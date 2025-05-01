var Joi = require("joi")
var bcrypt = require("bcrypt")

const BaseResponse = require("../../dto/BaseResponse")
var randomPassword = require("../../middleware/GenerateRandomPassword")

var userService = require("../../services/Users")
var siswaService = require("../../services/Siswa")
var jurusanService = require("../../services/Jurusan")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id_jurusan : Joi.string().required(),
        nis : Joi.string().max(50).required(),
        nisn : Joi.string().max(50).required(),
        nama : Joi.string().max(100).required(),
        alamat : Joi.string().required(),
        no_hp : Joi.string().max(20).required(),
        tempat_lahir : Joi.string().max(100).required(),
        tanggal_lahir : Joi.date().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id_jurusan, nis, nisn, nama, alamat, no_hp, tempat_lahir, tanggal_lahir } = value
    var role = "SISWA"

    // console.log(tanggal_lahir)
    // tanggal_lahir = format(new Date(tanggal_lahir), 'yyyy-MM-dd');

    const password = randomPassword.generateRandomPassword(8)

    if (!password.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password.data, salt)

    var cekJurusan = await jurusanService.findOne({
        id : id_jurusan
    })

    if(!cekJurusan.success){
        result.success = false
        result.message = "Data jurusan tidak terdaftar..."
        return res.status(404).json(result)
    }

    var newUser = await userService.createUser({
        username : nisn,
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

    var newSiswa = await siswaService.createNew({
        id_jurusan,
        nis,
        nisn,
        nama,
        alamat,
        no_hp,
        tempat_lahir,
        tanggal_lahir,
        foto: "https://gambarpkl.blob.core.windows.net/gambar-simpkl/1735314679-user-profile.png",
        createdBy : req.username
    })

    if (newSiswa.success) {
        result.message = "Siswa berhasil ditambahkan..."
        result.data = newSiswa.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler