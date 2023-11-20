var Joi = require("joi")
var bcrypt = require("bcrypt")

const BaseResponse = require("../../dto/BaseResponse")
var dataCons = require("../../utils/constants")
var randomPassword = require("../../middleware/GenerateRandomPassword")

var userService = require("../../services/Users")
var perusahaanService = require("../../services/Perusahaan")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        username : Joi.string().max(20).required(),
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

    var { username, nama_perusahaan, pimpinan, alamat, no_hp, email, website } = value
    var role = dataCons.PERUSAHAAN

    const password = randomPassword.generateRandomPassword(8)
    if (!password.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password.data, salt)

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
        temp_password : password.data,
        role,
        createdBy : req.username
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
        website,
        status: dataCons.AKTIF,
        createdBy : req.username
    })

    if (newPerusahaan.success) {
        result.message = "Perusahaan berhasil ditambahkan..."
        result.data = newPerusahaan.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler