var Joi = require("joi")
var siswaService = require("../../services/Siswa")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        status_aktif : Joi.boolean().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, status_aktif } = value

    var siswa = await siswaService.findOne({
        id
    })

    if (!siswa.success) {
        result.success = false
        result.message = "Data siswa tidak ditemukan..."
        return res.status(404).json(result)
    }

    var updatedStatusSiswa = await siswaService.updateStatus(
        id,
        {
            status_aktif,
            updatedBy : req.username
        }
    )

    if (updatedStatusSiswa.success) {
        result.message = "Status siswa berhasil diubah..."
        result.data = updatedStatusSiswa.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler