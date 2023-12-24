const BaseResponse = require("../../dto/BaseResponse");
var Joi = require("joi")

var aspekPenilaianService = require("../../services/AspekPenilaian")

async function handler(req, res) {
    var result = new BaseResponse();
    
    var schema = Joi.object({
        id: Joi.string().required(),
        judul : Joi.string().allow(null, ''),
        kelompok_penilaian : Joi.string(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, judul, kelompok_penilaian } = value

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
            kelompok_penilaian,
            updatedBy: req.username
        }
    )

    if (updatedAspekPenilaian.success) {
        result.message = "Data aspek penilaian berhasil diubah..."
        result.data = updatedAspekPenilaian.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler