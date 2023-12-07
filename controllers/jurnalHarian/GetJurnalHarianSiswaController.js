const BaseResponse = require("../../dto/BaseResponse")

var jurnalHarianService = require("../../services/JurnalHarian")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var siswaService = require("../../services/Siswa")

async function handler(req, res) {
    var result = new BaseResponse()

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
        result.message = "Internal Server Error"
        result.error = "Data Siswa tidak ditemukan"
        return res.status(400).json(result)
    }
    
    var jurnalHarian = await jurnalHarianService.findOne({
        tanggal
    })

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