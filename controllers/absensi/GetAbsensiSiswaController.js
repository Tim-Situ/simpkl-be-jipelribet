const BaseResponse = require("../../dto/BaseResponse")
const siswaService = require("../../services/Siswa")
const kelompokBimbinganService = require("../../services/KelompokBimbingan")
const absensiService = require("../../services/Absensi")

async function handler(req, res) {
    const result = new BaseResponse()

    if ( !req.query.bulan || !req.query.tahun ) {
        result.success = false
        result.message = "Parameter bulan dan tahun harus diisi..."
        return res.status(400).json(result)
    }

    var where, select, orderBy
    orderBy = {}
    

    const bulan = req.query.bulan
    const tahun = req.query.tahun

    var cekSiswa =  await siswaService.findOne({
        nisn: req.username
    })

    var id_siswa = cekSiswa.data.id

    select = {
        id: true,
        status: true,
    }

    where = {
        id_siswa
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.getAll(
        where, select, orderBy
    )

    if (cekKelompokBimbingan.data.length > 1) {
        where = {
            OR: [],
            tanggal: {
                gte: new Date(tahun, bulan - 1, 1),
                lt: new Date(tahun, bulan, 1)
            }
            
        }
        
        cekKelompokBimbingan.data.forEach(data => {
            where.OR.push({ id_bimbingan: data.id });
        });
    } else {
        where = {
            id_bimbingan : cekKelompokBimbingan.data[0].id,
            tanggal: {
                gte: new Date(tahun, bulan - 1, 1),
                lt: new Date(tahun, bulan, 1)
            },
        }
    }

    // var id_bimbingan = cekKelompokBimbingan.data.id

    var absensi = await absensiService.search(
        // {
        //     id_bimbingan,
        //     tanggal: {
        //         gte: new Date(tahun, bulan - 1, 1),
        //         lt: new Date(tahun, bulan, 1)
        //     },
        // },
        where,
        {},
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
        return res.status(404).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler