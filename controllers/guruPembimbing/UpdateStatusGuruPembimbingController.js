var Joi = require("joi")
var guruPembimbingService = require("../../services/GuruPembimbing")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().max(100).required(),
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

    var guruPembimbing = await guruPembimbingService.findOne({
        id
    })

    if (!guruPembimbing.success) {
        result.success = false
        result.message = "Data guru pembimbing tidak ditemukan..."
        return res.status(404).json(result)
    }

    var updatedStatusGuruPembimbing = await guruPembimbingService.updateStatus(
        id,
        {
            status_aktif,
            updatedBy : req.username
        }
    )

    if (updatedStatusGuruPembimbing.success) {
        result.message = "Status guru pembimbing berhasil diubah..."
        result.data = updatedStatusGuruPembimbing.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler