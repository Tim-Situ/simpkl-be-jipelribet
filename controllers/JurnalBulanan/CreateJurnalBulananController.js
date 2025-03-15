var Joi = require("joi")

const BaseResponse = require("../../dto/BaseResponse")
var uploadFile = require("../../dto/ManageFile")
var {timeSettings} = require("../../utils/constants")
var jurnalBulananService = require("../../services/JurnalBulanan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var siswaService = require("../../services/Siswa")

const moment = require('moment-timezone');

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        bulan: Joi.number().integer().min(1).max(12).required(),
        tahun: Joi.number().integer().min(2000).max(2100).required(),
        pencapaian: Joi.string().required(),
        kendala: Joi.string().required(),
        rencana_perbaikan: Joi.string().required(),
        refleksi: Joi.string().required(),
        pembimbing: Joi.string().required(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { bulan, tahun, pencapaian, kendala, rencana_perbaikan, refleksi, pembimbing } = value

    // Get current date in Asia/Jakarta timezone
    const today = moment().tz('Asia/Jakarta');
    const inputDate = moment().month(bulan - 1).year(tahun);
    
    // Check if the month and year are in the future
    if (inputDate.isAfter(today, 'month')) {
        result.success = false
        result.message = "Tidak bisa upload jurnal bulanan untuk bulan di masa depan..."
        return res.status(400).json(result)
    }

    if (!req.file) {
        result.success = false
        result.message = "Dokumen laporan bulanan tidak boleh kosong..."
        return res.status(400).json(result)
    }

    var dataSiswa = await siswaService.findOne({
        nisn: req.username
    })

    if (!dataSiswa.success) {
        result.success = false
        result.message = "Terjadi kesalahan dalam sistem..."
        return res.status(500).json(result)
    }

    var dataKelompokBimbingan = await kelompokBimbinganService.findOne({
        AND: [
            { id_siswa : dataSiswa.data.id },
            { status : true }
        ]
    })

    if (!dataKelompokBimbingan.success) {
        result.success = false
        result.message = "Data kelompok bimbingan yang aktif tidak ditemukan..."
        return res.status(400).json(result)
    }

    try {
        // Ambil buffer file
        const file = req.file;
    
        const fileUrl = await uploadFile.uploadDocumentToAzure(file)
    
        var newData = await jurnalBulananService.createNew({
            id_bimbingan: dataKelompokBimbingan.data.id,
            bulan,
            tahun,
            pencapaian,
            kendala,
            rencana_perbaikan,
            refleksi,
            pembimbing,
            dokumen: fileUrl,
            createdBy: req.username,
            tanggal_upload: today.toDate()
        })
    
        if (newData.success) {
            result.message = "Jurnal bulanan berhasil ditambahkan..."
            result.data = newData.data
            res.status(201).json(result)
        } else {
            result.success = false
            result.message = "Internal Server Error"
            res.status(500).json(result)
        }

    } catch (error) {
        result.success = false
        result.message = "Terjadi kesalahan saat upload dokumen"
        result.data = error.message;
        return res.status(500).json(result)
    }
}

module.exports = handler