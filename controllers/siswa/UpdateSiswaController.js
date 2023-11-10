var Joi = require("joi")
var userService = require("../../services/Users")
var siswaService = require("../../services/Siswa")
var jurusanService = require("../../services/Jurusan")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().max(100).required(),
        id_jurusan : Joi.string().allow(null, ''),
        nis : Joi.string().max(50).allow(null, ''),
        nisn : Joi.string().max(50).allow(null, ''),
        nama : Joi.string().max(100).allow(null, ''),
        alamat : Joi.string().allow(null, ''),
        no_hp : Joi.string().max(20).allow(null, ''),
        tempat_lahir : Joi.string().max(100).allow(null, ''),
        tanggal_lahir : Joi.date().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, id_jurusan, nis, nisn, nama, alamat, no_hp, tempat_lahir, tanggal_lahir } = value

    var dataSiswa = await siswaService.findOne({
        id
    })

    if (!dataSiswa.success) {
        result.success = false
        result.message = "Data siswa tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekJurusan = await jurusanService.findOne({
        id : id_jurusan
    })

    if(!cekJurusan.success){
        result.success = false
        result.message = "Data jurusan tidak terdaftar..."
        return res.status(404).json(result)
    }

    if(nisn != null){
        var cekNisn = await userService.findUser({ 
            username : nisn
        })

        if(cekNisn.success && cekNisn.data.username != dataSiswa.data.nisn){
            result.success = false
            result.message = "NISN sudah digunakan..."
            return res.status(400).json(result)
        }

        var updateUser = await userService.updateUser(
            { username : dataSiswa.data.nisn},
            {
                username : nisn,
                updatedBy : req.username
            }
        )

        if (!updateUser.success) {
            result.success = false
            result.message = "Internal Server Error"
            res.status(500).json(result)
        }
    }
    
    var updateSiswa = await siswaService.updateData(
        {id},
        {
            id_jurusan,
            nis,
            nisn,
            nama,
            alamat,
            no_hp,
            tempat_lahir,
            tanggal_lahir,
            updatedBy : req.username
        }
    )

    if (updateSiswa.success) {
        result.message = "Data siswa berhasil diubah..."
        result.data = updateSiswa.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler