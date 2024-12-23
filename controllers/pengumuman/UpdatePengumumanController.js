const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var pengumumanService = require("../../services/Pengumuman")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        pengumuman: Joi.string(),
        status: Joi.boolean().allow(null, ''),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, pengumuman, status } = value

    var dataPengumuman = await pengumumanService.findOne({
        id
    })

    if (!dataPengumuman.success) {
        result.success = false
        result.message = "Data pengumuman tidak ditemukan..."
        return res.status(404).json(result)
    }

    var updatePengumuman = await pengumumanService.updateData(
        {id},
        {
            pengumuman,
            status,
            updatedBy: req.username
        }
    )

    if (updatePengumuman.success) {
        result.message = "Data pengumuman berhasil diubah..."
        result.data = updatePengumuman.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler
