const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var pengumumanService = require("../../services/Pengumuman")

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

    var cekPengumuman = await pengumumanService.findOne({
        id
    })

    if (!cekPengumuman.success) {
        result.success = false
        result.message = "Data pengumuman tidak ditemukan..."
        return res.status(400).json(result)
    }

    var deletePengumuman = await pengumumanService.deleteData({
        id
    })

    if (deletePengumuman.success) {
        result.message = "Data pengumuman berhasil dihapus..."
        return res.status(200).json(result)
        
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler