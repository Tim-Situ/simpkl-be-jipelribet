var Joi = require("joi")
var tahunAjaranService = require("../../services/TahunAjaran")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        tahun_ajaran: Joi.string().max(100).required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { tahun_ajaran } = value

    var newData = await tahunAjaranService.createNew({
        tahun_ajaran
    })

    if (newData.success) {
        result.message = "Data tahun ajaran berhasil ditambahkan..."
        result.data = newData.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler