const BaseResponse = require("../../dto/BaseResponse")

var jurnalHarianService = require("../../services/JurnalHarian")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var instrukturService = require("../../services/Instruktur")
var guruPembimbingService = require("../../services/GuruPembimbing")

async function handler(req, res) {
    var result = new BaseResponse()

    if (!req.query.bimbingan || !req.query.tanggal) {
        result.success = false
        result.message = "Parameter bimbingan dan tanggal harus diisi..."
        return res.status(400).json(result)
    }

    var id_bimbingan = req.query.bimbingan
    var tanggal = new Date(req.query.tanggal)

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id: id_bimbingan
    })

    if (!cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Kelompok bimbingan tidak ditemukan..."
        return res.status(400).json(result)
    }

    if (req.role === "PEMBIMBING") {
        var cekGuruPembimbing = await guruPembimbingService.findOne({
            nip: req.username
        })
        
        var id_guru_pembimbing = cekKelompokBimbingan.data.id_guru_pembimbing
        var user_id_pembimbing = cekGuruPembimbing.data.id

        if (id_guru_pembimbing !== user_id_pembimbing) {
            result.success = false
            result.message = "Anda tidak memiliki akses ke jurnal ini..."
            return res.status(403).json(result)
        }
    } else if (req.role === "INSTRUKTUR") {
        var cekInstruktur = await instrukturService.findOne({
            username: req.username
        })
        
        var id_instruktur = cekKelompokBimbingan.data.id_instruktur
        var user_id_instruktur = cekInstruktur.data.id

        if (id_instruktur !== user_id_instruktur) {
            result.success = false
            result.message = "Anda tidak memiliki akses ke jurnal ini..."
            return res.status(403).json(result)
        }
    }

    var where = {
        AND: [
            { id_bimbingan: id_bimbingan },
            { tanggal: tanggal}
        ]
    }
    
    var jurnalHarian = await jurnalHarianService.getAll(
        where,
        null
    )

    if (jurnalHarian.success && jurnalHarian.data.length == 0) {
        result.success = true
        result.message = "Data jurnal harian tidak ditemukan..."
        return res.status(404).json(result)
    } else if (jurnalHarian.success) {
        result.success = true
        result.message = "Data jurnal harian berhasil ditampilkan..."
        result.data = jurnalHarian.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler