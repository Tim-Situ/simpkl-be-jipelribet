const BaseResponse = require("../../dto/BaseResponse")

var jurnalHarianService = require("../../services/JurnalHarian")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var siswaService = require("../../services/Siswa")

async function handler(req, res) {
    var result = new BaseResponse()

    var where, select, orderBy
    orderBy = {}

    if (!req.query.tanggal) {
        result.success = false
        result.message = "Parameter tanggal harus diisi..."
        return res.status(400).json(result)
    }

    var tanggal = new Date(req.query.tanggal)

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
            tanggal
        }
    }
    
    var jurnalHarian = await jurnalHarianService.getAll(
        where
    )

    if (!jurnalHarian.success) {
        result.success = true
        result.message = "Data jurnal harian tidak ditemukan..."
        return res.status(404).json(result)
    } 

    result.success = true
    result.message = "Data jurnal harian berhasil ditampilkan..."
    result.data = jurnalHarian.data
    res.json(result)
}

module.exports = handler