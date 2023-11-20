const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var nilaiBulananService = require("../../services/NilaiBulanan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var tujuanPembelajaranService = require("../../services/TujuanPembelajaran")
var guruPembimbingService = require("../../services/GuruPembimbing")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id : Joi.string().required(),
        id_bimbingan : Joi.string().allow(null, ''),
        id_tujuan_pembelajaran : Joi.string().allow(null, ''),
        bulan : Joi.number().integer().min(1).max(12).allow(null, ''),
        tahun : Joi.number().integer().min(2000).max(9999).allow(null, ''),
        nilai: Joi.number().integer().min(0).max(100).allow(null, ''),
        deskripsi: Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, id_bimbingan, id_tujuan_pembelajaran, bulan, tahun, nilai, deskripsi } = value
    var id_guru_pembimbing

    var cekNilaiBulanan = await nilaiBulananService.findOne({
        id: id
    })

    if (!cekNilaiBulanan.success) {
        result.success = false
        result.message = "Data nilai bulanan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id: id_bimbingan
    })

    if (!cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Data kelompok bimbingan tidak terdaftar..."
        return res.status(400).json(result)
    }

    var cekTujuanPembelajaran = await tujuanPembelajaranService.findOne({
        id: id_tujuan_pembelajaran
    })

    if (!cekTujuanPembelajaran.success) {
        result.success = false
        result.message = "Data tujuan pembelajaran tidak ditemukan..."
        return res.status(400).json(result)
    }

    var cekGuruPembimbing = await guruPembimbingService.findOne({
        nip: req.username
    })

    if (cekGuruPembimbing.success) {
        id_guru_pembimbing = cekGuruPembimbing.data.id
    } else {
        result.success = false
        result.message = "Terjadi kesalahan di sistem..."
        return res.status(500).json(result)
    }

    var cekAksesGuruPembimbing = await kelompokBimbinganService.findOne({
        id: id_bimbingan,
        id_guru_pembimbing: id_guru_pembimbing
    })

    if (!cekAksesGuruPembimbing.success) {
        result.success = false
        result.message = "Anda tidak memiliki akses untuk menambahkan nilai kelompok bimbingan ini..."
        return res.status(403).json(result)
    }

    var newNilaiBulanan = await nilaiBulananService.updateData(
        id,
    {
        id_bimbingan,
        id_tujuan_pembelajaran,
        bulan,
        tahun,
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