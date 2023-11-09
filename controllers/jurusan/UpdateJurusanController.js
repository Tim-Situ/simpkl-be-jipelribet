var Joi = require("joi")
var jurusanService = require("../../services/Jurusan")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().max(100).required(),
        bidang_keahlian: Joi.string().max(225).allow(null, ''),
        program_keahlian: Joi.string().max(225).allow(null, ''),
        kompetensi_keahlian: Joi.string().max(225).allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, bidang_keahlian, program_keahlian, kompetensi_keahlian } = value

    var jurusan = await jurusanService.findOne({
        id
    })

    if (jurusan.success && jurusan.data == null) {
        result.success = false
        result.message = "Data jurusan tidak ditemukan..."
        return res.status(404).json(result)
    }else if(!jurusan.success){
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }

    var updatedJurusan = await jurusanService.updateData(
        id,
        {
            bidang_keahlian,
            program_keahlian,
            kompetensi_keahlian,
            updatedBy : req.username
        }
    )

    if (updatedJurusan.success) {
        result.message = "Data jurusan berhasil diubah..."
        result.data = updatedJurusan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler