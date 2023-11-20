const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var tujuanPembelajaranService = require("../../services/TujuanPembelajaran")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        judul : Joi.string().allow(null, ''),
        deskripsi : Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)
    
    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, judul, deskripsi } = value

    var dataTujuanPembelajaran = await tujuanPembelajaranService.findOne({
        id
    })

    if (!dataTujuanPembelajaran.success) {
        result.success = false
        result.message = "Data tujuan pembelajaran tidak ditemukan..."
        return res.status(404).json(result)
    }

    var updatedTujuanPembelajaran = await tujuanPembelajaranService.updateData(
        id,
        {
            judul,
            deskripsi,
            updatedBy : req.username
        }
    )

    if (updatedTujuanPembelajaran.success) {
        result.message = "Data tujuan pembelajaran berhasil diubah..."
        result.data = updatedTujuanPembelajaran.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler