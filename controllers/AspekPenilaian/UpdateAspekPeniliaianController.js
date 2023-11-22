const BaseResponse = require("../../dto/BaseResponse");
var Joi = require("joi")

var aspekPenilaianService = require("../../services/AspekPenilaian")

async function handler(req, res) {
    var result = new BaseResponse();
    
    var schema = Joi.object({
        id: Joi.string().required(),
        judul : Joi.string().allow(null, ''),
        kode : Joi.string().uppercase().length(1).allow(null, ''),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, judul, kode } = value

    var cekAspekPenilaian = await aspekPenilaianService.findOne({
        id
    })

    if (!cekAspekPenilaian.success) {
        result.success = false
        result.message = "Data aspek penilaian tidak ditemukan..."
        return res.status(404).json(result)
    }

    var updatedAspekPenilaian = await aspekPenilaianService.updateData(
        id,
        {
            judul,
            kode,
            updatedBy: req.username
        }
    )

    if (updatedAspekPenilaian.success) {
        result.message = "Data aspek penilaian berhasil diubah..."
        result.data = updatedAspekPenilaian.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler