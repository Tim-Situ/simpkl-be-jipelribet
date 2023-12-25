const BaseResponse = require('../../dto/BaseResponse')

var nilaiBulananService = require('../../services/NilaiBulanan')
var siswaService = require('../../services/Siswa')
var kelompokBimbinganService = require('../../services/KelompokBimbingan')

async function handler(req, res) {
    var result = new BaseResponse()

    if ( !req.query.bulan || !req.query.tahun ) {
        result.success = false
        result.message = "Parameter bulan dan tahun harus diisi..."
        return res.status(400).json(result)
    }
    
    var bulan = parseInt(req.query.bulan)
    var tahun = parseInt(req.query.tahun)

    var cekSiswa = await siswaService.findOne({
        nisn: req.username
    })

    var id_siswa = cekSiswa.data.id
    
    var cekKelompokBimbingan = await kelompokBimbinganService.search({
        id_siswa
    })

    if (cekKelompokBimbingan.data.length > 1) {
        var where = {
            AND: [
                {
                    OR: []
                },
                { bulan: bulan },
                { tahun: tahun },
            ]
        }
        
        cekKelompokBimbingan.data.forEach(data => {
            where.AND[0].OR.push({ id_bimbingan: data.id });
        });
    } else {
        var where = {
            AND: [
                { id_bimbingan: cekKelompokBimbingan.data[0].id },
                { bulan: bulan },
                { tahun: tahun },
            ]
        }
    }

    var orderBy = { id_tujuan_pembelajaran : 'asc' }
    var include = {
        tujuan_pembelajaran: true
    }

    var nilaiBulanan = await nilaiBulananService.getAll(
        where,
        orderBy,
        include
    )

    if (nilaiBulanan.success && nilaiBulanan.data.length === 0) {
        result.message = "Data nilai bulanan tidak ditemukan..."
        result.data = nilaiBulanan.data
        return res.status(404).json(result)
    }
    
    if (nilaiBulanan.success && nilaiBulanan.data.length > 0) {
        result.message = "Data nilai bulanan berhasil ditampilkan..."
        result.data = nilaiBulanan.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler