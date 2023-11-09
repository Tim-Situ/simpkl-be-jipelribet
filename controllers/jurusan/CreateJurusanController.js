var Joi = require("joi")
var jurusanService = require("../../services/Jurusan")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        bidang_keahlian: Joi.string().max(225).required(),
        program_keahlian: Joi.string().max(225).required(),
        kompetensi_keahlian: Joi.string().max(225).required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { bidang_keahlian, program_keahlian, kompetensi_keahlian } = value

    var newData = await jurusanService.createNew({
        bidang_keahlian,
        program_keahlian,
        kompetensi_keahlian,
        createdBy : req.username
    })

    if (newData.success) {
        result.message = "Data jurusan berhasil ditambahkan..."
        result.data = newData.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler