const BaseResponse = require("../../dto/BaseResponse")

var jurnalHarianService = require("../../services/JurnalHarian")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var instrukturService = require("../../services/Instruktur")
var guruPembimbingService = require("../../services/GuruPembimbing")

async function handler(req, res) {
    var result = new BaseResponse()

    if (!req.query.tanggal) {
        result.success = false
        result.message = "Tanggal jurnal harus diisi..."
        return res.status(400).json(result)
    }

    var tanggal = new Date(req.query.tanggal)
    var where, select, orderBy, include

    if (req.role === "PEMBIMBING") {
        var cekGuruPembimbing = await guruPembimbingService.findOne({
            nip: req.username
        })

        where = {
            id_guru_pembimbing: cekGuruPembimbing.data.id,
            // status: true
        }

    } else if (req.role === "INSTRUKTUR") {
        var cekInstruktur = await instrukturService.findOne({
            username: req.username
        })
        
        where = {
            id_instruktur: cekInstruktur.data.id,
            // status: true
        }
    }

    select = {
        id: true
    }

    var dataKelompokBimbingan = await kelompokBimbinganService.getAll(
        where, select, orderBy
    )

    if (dataKelompokBimbingan.data.length > 1) {
        where = {
            AND: [
                {
                    OR: []
                },
                { tanggal }
            ]
        }
        
        dataKelompokBimbingan.data.forEach(data => {
            where.AND[0].OR.push({ id_bimbingan: data.id });
        });

        include = {
            kelompok_bimbingan: {
                include: {
                    siswa: true,
                    perusahaan: true,
                    instruktur: true
                }
            }
        }
    } else if(dataKelompokBimbingan.data.length == 1){
        where = {
            AND: [
                { id_bimbingan: dataKelompokBimbingan.data[0].id },
                { tanggal }
            ]
        }

        include = {
            kelompok_bimbingan: {
                include: {
                    siswa: true,
                    perusahaan: true,
                    guru_pembimbing: true
                }
            }
        }
    }else{
        result.success = true
        result.message = "Kelompok bimbingan yang aktif tidak tersedia..."
        return res.status(404).json(result)
    }

    var jurnalHarian = await jurnalHarianService.getAll(
        where,
        include
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