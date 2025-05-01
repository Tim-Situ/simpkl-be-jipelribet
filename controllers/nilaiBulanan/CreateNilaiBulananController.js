const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var nilaiBulananService = require("../../services/NilaiBulanan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var tujuanPembelajaranService = require("../../services/TujuanPembelajaran")
var guruPembimbingService = require("../../services/GuruPembimbing")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id_bimbingan : Joi.string().required(),
        bulan : Joi.number().integer().min(1).max(12).required(),
        tahun : Joi.number().integer().min(2000).max(9999).required(),
        data: Joi.array().items(
            Joi.object({
                id_tujuan_pembelajaran : Joi.string().required(),
                nilai: Joi.number().integer().required(),
                deskripsi: Joi.string().required()
            })
        ),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id_bimbingan, bulan, tahun, data} = value
    var id_guru_pembimbing

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id: id_bimbingan
    })

    if (!cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Data kelompok bimbingan tidak terdaftar..."
        return res.status(400).json(result)
    }

    for (let i = 0; i < data.length; i++) {
        var cekTujuanPembelajaran = await tujuanPembelajaranService.findOne({
            id: data[i].id_tujuan_pembelajaran
        })
    
        if (!cekTujuanPembelajaran.success) {
            result.success = false
            result.message = "Salah satu data tujuan pembelajaran tidak ditemukan..."
            return res.status(400).json(result)
        }
    }

    // Revisi: pengecekan guru pembimbing di kelompok bimbingan
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

    var newNilaiBulanan = await nilaiBulananService.createBulk({
        id_bimbingan,
        bulan,
        tahun,
        nilaiBulanan: data,
        createdBy: req.username,
    })

    if (newNilaiBulanan.success) {
        result.message = "Nilai bulanan berhasil ditambahkan..."
        result.data = newNilaiBulanan.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler