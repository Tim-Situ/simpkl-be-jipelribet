var Joi = require("joi")
var bcrypt = require("bcrypt")

const BaseResponse = require("../../dto/BaseResponse")
var dataCons = require("../../utils/constants")
const cekPassword = require("../../dto/CekPasswordValid")

var userService = require("../../services/Users")
var perusahaanService = require("../../services/Perusahaan")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        username : Joi.string().min(5).max(20).required(),
        password : Joi.string().min(8).required(),
        nama_perusahaan : Joi.string().max(100).required(),
        pimpinan : Joi.string().max(100).required(),
        alamat : Joi.string().required(),
        no_hp : Joi.string().max(25).required(),
        email : Joi.string().allow(null, ''),
        website : Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { username, password, nama_perusahaan, pimpinan, alamat, no_hp, email, website } = value
    var role = dataCons.PERUSAHAAN

    const cekPasswordValid = cekPassword.cekPasswordValid(password)
    if (!cekPasswordValid.success) {
        result.success = false
        result.message = "Password harus terdiri minimal 1 huruf kecil, 1 huruf besar, 1 angka dan 1 karakter spesial"
        return res.status(400).json(result) 
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)

    var cekUsername = await userService.findUser({
        username
    })

    if(cekUsername.success){
        result.success = false
        result.message = "Username sudah digunakan..."
        return res.status(400).json(result)
    }

    var newUser = await userService.createUser({
        username,
        password : hashPassword,
        role
    })

    if (!newUser.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }

    var newPerusahaan = await perusahaanService.registrasi({
        username,
        nama_perusahaan,
        pimpinan,
        alamat,
        no_hp,
        email,
        website
    })

    if (newPerusahaan.success) {
        result.message = "Registrasi berhasil..."
        result.data = newPerusahaan.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler