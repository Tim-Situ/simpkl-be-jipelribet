const BaseResponse = require("../../dto/BaseResponse")

var jurnalBulananService = require("../../services/JurnalBulanan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var siswaService = require("../../services/Siswa")

async function handler(req, res) {
    var result = new BaseResponse()

    var where, select, orderBy
    orderBy = {}

    if (!req.query.bulan || !req.query.tahun) {
        result.success = false
        result.message = "Parameter bulan dan tahun harus diisi..."
        return res.status(400).json(result)
    }

    var bulan = parseInt(req.query.bulan)
    var tahun = parseInt(req.query.tahun)
    
    // Validasi bulan dan tahun
    if (isNaN(bulan) || bulan < 1 || bulan > 12) {
        result.success = false
        result.message = "Bulan harus berupa angka antara 1 sampai 12..."
        return res.status(400).json(result)
    }

    if (isNaN(tahun) || tahun < 2000 || tahun > 2100) {
        result.success = false
        result.message = "Tahun harus berupa angka antara 2000 sampai 2100..."
        return res.status(400).json(result)
    }

    var dataSiswa = await siswaService.findOne({
        nisn: req.username
    })
    
    if (!dataSiswa.success) {
        result.success = false
        result.message = "Data Siswa tidak ditemukan"
        return res.status(400).json(result)
    }

    select = {
        id: true,
        status: true,
    }

    where = {
        id_siswa: dataSiswa.data.id
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.getAll(
        where, select, orderBy
    )

    if (cekKelompokBimbingan.data.length === 0) {
        result.success = false
        result.message = "Kelompok bimbingan tidak ditemukan..."
        return res.status(404).json(result)
    }

    if (cekKelompokBimbingan.data.length > 1) {
        where = {
            AND: [
                {
                    OR: []
                },
                { bulan },
                { tahun }
            ]
        }
        
        cekKelompokBimbingan.data.forEach(data => {
            where.AND[0].OR.push({ id_bimbingan: data.id });
        });
    } else {
        where = {
            id_bimbingan: cekKelompokBimbingan.data[0].id,
            bulan,
            tahun
        }
    }
    
    var jurnalBulanan = await jurnalBulananService.getAll(
        where
    )

    if (!jurnalBulanan.success) {
        result.success = true
        result.message = "Data jurnal bulanan tidak ditemukan..."
        return res.status(404).json(result)
    } 

    result.success = true
    result.message = "Data jurnal bulanan berhasil ditampilkan..."
    result.data = jurnalBulanan.data
    res.json(result)
}

module.exports = handler