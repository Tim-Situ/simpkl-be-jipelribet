const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var siswaService = require("../../services/Siswa")
var userService = require("../../services/Users")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id } = value

    var cekSiswa = await siswaService.findOne({
        id
    })

    if (!cekSiswa.success) {
        result.success = false
        result.message = "Data Siswa tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id_siswa: cekSiswa.data.id
    })

    if (cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Data siswa masih ada dalam kelompok bimbingan!!!"
        return res.status(400).json(result)
    }

    var deleteDataSiswa = await siswaService.deleteData({
        id
    })

    var deleteDataUser = await userService.deleteData({
        username: cekSiswa.data.nisn
    })

    if (deleteDataSiswa.success && deleteDataUser.success) {
        result.message = "Data siswa berhasil dihapus..."
        return res.status(200).json(result)
        
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler