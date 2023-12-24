const BaseResponse = require('../../dto/BaseResponse')
const guruPembimbingService = require('../../services/GuruPembimbing')
const kelompokBimbinganService = require("../../services/KelompokBimbingan")
const absensiService = require("../../services/Absensi")
const jurnalService = require("../../services/JurnalHarian")

async function handler(req, res) {
    const result = new BaseResponse()

    var where, select, orderBy
    orderBy = {}

    if ( !req.query.tanggal) {
        result.success = false
        result.message = "Parameter tanggal harus diisi..."
        return res.status(400).json(result)
    }

    var tanggal = new Date(req.query.tanggal)

    var cekGuruPembimbing =  await guruPembimbingService.findOne({
        nip: req.username
    })

    var id_guru_pembimbing = cekGuruPembimbing.data.id

    select = {
        id: true,
        status: true,
    }

    where = {
        id_guru_pembimbing 
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.getAll(
        where, select, orderBy
    )

    if (cekKelompokBimbingan.data.length > 1) {
        where = {
            OR: [],
            tanggal
        }
        
        cekKelompokBimbingan.data.forEach(data => {
            where.OR.push({ id_bimbingan: data.id });
        });
    } else {
        where = {
            id_bimbingan : cekKelompokBimbingan.data[0].id,
            tanggal,
        }
    }

    include = {
        kelompok_bimbingan: {
            include: {
                siswa: true
            }
        }
    }

    var absensi = await absensiService.search(
        where,
        include,
        {
            tanggal: 'asc',
        }
    )

    if (absensi.success && absensi.data.length > 0) {
        result.success = true
        result.message = "Data absensi berhasil ditampilkan..."
        result.data = absensi.data
        return res.status(200).json(result)

    }
    
    // Jika data belum ada di db, maka cek jurnal harian

    select = {
        id: true,
        status: true,
        siswa: {
            select: {
                id: true,
                nis: true,
                nisn: true,
                nama: true
            }
        }
    }

    where = {
        id_guru_pembimbing,
        status: true
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.getAll(
        where, select, orderBy
    )

    if (cekKelompokBimbingan.success && cekKelompokBimbingan.data.length == 0) {
        result.success = false
        result.message = "Data Kelompok Bimbingan Tidak Ditemukan"
        return res.status(404).json(result)
    }else if(!cekKelompokBimbingan.success){
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }

    var dataResponse = []

    for (let i = 0; i < cekKelompokBimbingan.data.length; i++) {
        var jurnal = await jurnalService.findOne({
            id_bimbingan : cekKelompokBimbingan.data[i].id,
            tanggal
        })
        
        dataResponse.push({
            id_bimbingan: cekKelompokBimbingan.data[i].id,
            tanggal,
            status: "-",
            kelompok_bimbingan: {
                id: cekKelompokBimbingan.data[i].id,
                siswa: {
                    id: cekKelompokBimbingan.data[i].siswa.id,
                    nis: cekKelompokBimbingan.data[i].siswa.nis,
                    nisn: cekKelompokBimbingan.data[i].siswa.nisn,
                    nama: cekKelompokBimbingan.data[i].siswa.nama,
                }
            }
        })

        if (jurnal.success) {
            dataResponse[i].status = "HADIR"
        } else {
            dataResponse[i].status = "ALPA"
        }
    }

    result.success = true
    result.message = "Data absensi berhasil ditampilkan..."
    result.data = dataResponse
    res.status(200).json(result)

    
}

module.exports = handler