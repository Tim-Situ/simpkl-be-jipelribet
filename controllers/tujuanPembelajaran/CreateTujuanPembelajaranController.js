const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var tujuanPembelajaranService = require("../../services/TujuanPembelajaran")

async function handler(req, res) {
    var result = new BaseResponse();
    
    var schema = Joi.object({
        judul : Joi.string().required(),
        deskripsi : Joi.string().required(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { judul, deskripsi } = value

    var newTujuanPembelajaran = await tujuanPembelajaranService.createNew({
        judul,
        deskripsi,
        createdBy: req.username
    })

    if (newTujuanPembelajaran.success) {
        result.message = "Tujuan Pembelajaran berhasil ditambahkan..."
        result.data = tujuanPembelajaranService.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler