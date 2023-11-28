var Joi = require("joi")

const BaseResponse = require("../../dto/BaseResponse")
var uploadFile = require("../../dto/ManageFile")
var {timeSettings} = require("../../utils/constants")
var jurnalHarianService = require("../../services/JurnalHarian")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var siswaService = require("../../services/Siswa")

const moment = require('moment-timezone');

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        hari: Joi.string().required(),
        tanggal: Joi.date().required(),
        jenis_pekerjaan: Joi.string().required(),
        deskripsi_pekerjaan: Joi.string().required(),
        bentuk_kegiatan: Joi.string().required(),
        jam_mulai: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
        jam_selesai: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
        staf: Joi.string().required(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { hari, tanggal, jenis_pekerjaan, deskripsi_pekerjaan, bentuk_kegiatan, jam_mulai, jam_selesai, staf } = value

    // const today = new Date();
    const today = moment().tz('Asia/Jakarta').format();
    const startTime = new Date();
    const endTime = new Date();

    var [hour, minute, second] = jam_mulai.split(':');
    startTime.setUTCHours(parseInt(hour), parseInt(minute), parseInt(second));

    var [hour, minute, second] = jam_selesai.split(':');
    endTime.setUTCHours(parseInt(hour), parseInt(minute), parseInt(second));

    if (tanggal > today) {
        result.success = false
        result.message = "Tidak bisa upload jurnal pada tanggal tersebut..."
        return res.status(400).json(result)
    }

    var cekJurnalHarian = await jurnalHarianService.findOne({
        tanggal
    })

    if (cekJurnalHarian.success) {
        result.success = false
        result.message = "Jurnal pada hari ini sudah ada..."
        return res.status(400).json(result)
    }

    if (!req.file) {
        result.success = false
        result.message = "Foto kegiatan tidak boleh kosong..."
        return res.status(400).json(result)
    }

    try {
        const fotoUrl = await uploadFile.uploadImageToS3(req.file, req.username);

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
    
        var newData = await jurnalHarianService.createNew({
            id_bimbingan: dataKelompokBimbingan.data.id,
            hari,
            tanggal,
            jenis_pekerjaan,
            deskripsi_pekerjaan,
            bentuk_kegiatan, 
            jam_mulai : startTime,
            jam_selesai : endTime, 
            staf,
            foto : fotoUrl,
            createdBy: req.username
        })
    
        if (newData.success) {
            result.message = "Jurnal harian berhasil ditambahkan..."
            result.data = newData.data
            res.status(201).json(result)
        } else {
            result.success = false
            result.message = "Internal Server Error"
            res.status(500).json(result)
        }

    } catch (error) {
        result.success = false
        result.message = "Terjadi kesalahan saat upload foto"
        return res.status(500).json(result)
    }
}

module.exports = handler