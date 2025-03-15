const BaseResponse = require("../../dto/BaseResponse")

var jurnalBulananService = require("../../services/JurnalBulanan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var instrukturService = require("../../services/Instruktur")
var guruPembimbingService = require("../../services/GuruPembimbing")

async function handler(req, res) {
    var result = new BaseResponse()

    if (!req.query.bulan || !req.query.tahun) {
        result.success = false
        result.message = "Bulan dan tahun jurnal bulanan harus diisi..."
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

    var where, select, orderBy, include

    if (req.role === "PEMBIMBING") {
        var cekGuruPembimbing = await guruPembimbingService.findOne({
            nip: req.username
        })

        where = {
            id_guru_pembimbing: cekGuruPembimbing.data.id,
            // status: true
        }

        include = {
            kelompok_bimbingan: {
                include: {
                    siswa: true,
                    perusahaan: true,
                    instruktur: true
                }
            }
        }

    } else if (req.role === "INSTRUKTUR") {
        var cekInstruktur = await instrukturService.findOne({
            username: req.username
        })
        
        where = {
            id_instruktur: cekInstruktur.data.id,
            // status: true
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
                { bulan },
                { tahun }
            ]
        }
        
        dataKelompokBimbingan.data.forEach(data => {
            where.AND[0].OR.push({ id_bimbingan: data.id });
        });
        
    } else if(dataKelompokBimbingan.data.length == 1){
        where = {
            AND: [
                { id_bimbingan: dataKelompokBimbingan.data[0].id },
                { bulan },
                { tahun }
            ]
        }
        
    } else {
        result.success = true
        result.message = "Kelompok bimbingan yang aktif tidak tersedia..."
        return res.status(404).json(result)
    }

    var jurnalBulanan = await jurnalBulananService.getAll(
        where,
        include
    )

    if (jurnalBulanan.success && jurnalBulanan.data.length == 0) {
        result.success = true
        result.message = "Data jurnal bulanan tidak ditemukan..."
        return res.status(404).json(result)
    } else if (jurnalBulanan.success) {
        result.success = true
        result.message = "Data jurnal bulanan berhasil ditampilkan..."
        result.data = jurnalBulanan.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler