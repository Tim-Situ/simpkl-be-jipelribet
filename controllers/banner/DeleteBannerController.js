const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var jurusanService = require("../../services/Jurusan")

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

    var cekJurusan = await jurusanService.findOne({
        id
    })

    if (!cekJurusan.success) {
        result.success = false
        result.message = "Data Jurusan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekSiswa = await siswaService.findOne({
        id_jurusan: id
    })

    if (cekSiswa.success) {
        result.success = false
        result.message = "Data siswa dengan jurusan ini masih ada!!!"
        return res.status(400).json(result)
    }

    var deleteData = await jurusanService.deleteData({
        id
    })

    if (deleteData.success) {
        result.message = "Data jurusan berhasil dihapus..."
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler