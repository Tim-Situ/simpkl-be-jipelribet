const BaseResponse = require("../../dto/BaseResponse");
var Joi = require("joi")

var aspekPenilaianService = require("../../services/AspekPenilaian")

async function handler(req, res) {
    var result = new BaseResponse();
    
    var schema = Joi.object({
        judul : Joi.string().required(),
        kelompok_penilaian : Joi.string().required(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { judul, kelompok_penilaian } = value

    var newAspekPenilaian = await aspekPenilaianService.createNew({
        judul,
        kelompok_penilaian,
        createdBy: req.username
    })

    if (newAspekPenilaian.success) {
        result.message = "Aspek Penilaian berhasil ditambahkan..."
        result.data = newAspekPenilaian.data
        return res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler