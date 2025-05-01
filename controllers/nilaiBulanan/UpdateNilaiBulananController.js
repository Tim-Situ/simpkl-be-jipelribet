const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var nilaiBulananService = require("../../services/NilaiBulanan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var guruPembimbingService = require("../../services/GuruPembimbing")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id : Joi.string().required(),
        nilai: Joi.number().integer().allow(null, ''),
        deskripsi: Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, nilai, deskripsi } = value

    var cekNilaiBulanan = await nilaiBulananService.findOne({
        id
    })

    if (!cekNilaiBulanan.success) {
        result.success = false
        result.message = "Data nilai bulanan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id: cekNilaiBulanan.data.id_bimbingan
    })

    var cekGuruPembimbingan = await guruPembimbingService.findOne({
        nip: req.username
    })

    if (cekKelompokBimbingan.data.id_guru_pembimbing !== cekGuruPembimbingan.data.id) {
        result.success = false
        result.message = "Anda tidak memiliki akses untuk menambahkan nilai kelompok bimbingan ini..."
        return res.status(403).json(result)
    }

    var newNilaiBulanan = await nilaiBulananService.updateData(
        id,
    {
        nilai,
        deskripsi,
        updatedBy: req.username,
    })

    if (newNilaiBulanan.success) {
        result.message = "Data nilai bulanan berhasil diubah..."
        result.data = newNilaiBulanan.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler