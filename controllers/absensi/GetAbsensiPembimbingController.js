const BaseResponse = require('../../dto/BaseResponse')
const guruPembimbingService = require('../../services/GuruPembimbing')
const kelompokBimbinganService = require("../../services/KelompokBimbingan")
const absensiService = require("../../services/Absensi")

async function handler(req, res) {
    const result = new BaseResponse()

    if ( !req.query.bulan || !req.query.tahun || !req.query.bimbingan ) {
        result.success = false
        result.message = "Parameter bulan, tahun dan bimbingan harus diisi..."
        return res.status(400).json(result)
    }

    const bulan = req.query.bulan
    const tahun = req.query.tahun
    const id_bimbingan = req.query.bimbingan

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id: id_bimbingan
    })

    if (!cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Kelompok bimbingan tidak ditemukan..."
        return res.status(400).json(result)
    }

    const id_guru_pembimbing = cekKelompokBimbingan.data.id_guru_pembimbing

    var cekGuruPembimbing = await guruPembimbingService.findOne({
        nip: req.username
    })

    const user_id = cekGuruPembimbing.data.id

    if (id_guru_pembimbing !== user_id) {
        result.success = false
        result.message = "Anda tidak memiliki akses ke absensi ini..."
        return res.status(403).json(result)
    }

    var absensi = await absensiService.search(
        {
            id_bimbingan,
            tanggal: {
                gte: new Date(tahun, bulan - 1, 1),
                lt: new Date(tahun, bulan, 1)
            },
        },
        {
            tanggal: 'asc',
        }
    )

    if (absensi.success && absensi.data.length > 0) {
        
        var jml_kehadiran = {
            HADIR: 0,
            LIBUR: 0,
            SAKIT: 0,
            ALPA: 0,
            IZIN: 0,
        }

        absensi.data.forEach(element => {
            if (element.status === "HADIR") {
                jml_kehadiran.HADIR += 1
            } else if (element.status === "LIBUR") {
                jml_kehadiran.LIBUR += 1
            } else if (element.status === "SAKIT") {
                jml_kehadiran.SAKIT += 1
            } else if (element.status === "ALPA") {
                jml_kehadiran.ALPA += 1
            } else if (element.status === "IZIN") {
                jml_kehadiran.IZIN += 1
            }
        });

        var dataAbsensi = {
            jml_kehadiran,
            data_kehadiran: absensi.data
        }

        result.success = true
        result.message = "Data absensi berhasil ditampilkan..."
        result.data = dataAbsensi
        return res.status(200).json(result)
    } else if (absensi.success && absensi.data.length === 0) {
        result.success = true
        result.message = "Data absensi tidak ditemukan..."
        result.data = absensi.data
        return res.status(401).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler