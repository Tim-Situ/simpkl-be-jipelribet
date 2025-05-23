const BaseResponse = require("../../dto/BaseResponse")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var perusahaanService = require("../../services/Perusahaan")
var tahunAjaranService = require("../../services/TahunAjaran")

async function handler(req, res) {
    var result = new BaseResponse()
    var where, select, orderBy

    var perusahaan = await perusahaanService.findOne({
        username: req.username
    })

    if(!perusahaan.success){
        result.success = false
        result.message = "Terjadi kesalahan di sistem..."
        return res.status(500).json(result)
    }

    var tahunAjaran = await tahunAjaranService.findOne({
        status: true
    })

    if(!tahunAjaran.success){
        result.success = false
        result.message = "Terjadi kesalahan di sistem..."
        return res.status(500).json(result)
    }

    if(req.query.idInstruktur){
        where = {
            id_perusahaan: perusahaan.data.id,
            id_tahun_ajaran: tahunAjaran.data.id,
            id_instruktur: req.query.idInstruktur
        }
    }else{
        where = {
            id_perusahaan: perusahaan.data.id,
            id_tahun_ajaran: tahunAjaran.data.id,
        }
    }

    orderBy = {
        status: 'desc'
    }

    select = {
        id: true,
        status: true,
        siswa: {
            include: {
                jurusan: true
            }
        },
        guru_pembimbing: true,
        instruktur: true,
        tahun_ajaran: true
    }

    var kelompokBimbingan = await kelompokBimbinganService.getAll(
        where, select, orderBy
    )

    if(kelompokBimbingan.success && kelompokBimbingan.data.length == 0){
        result.success = true
        result.message = "Data Kelompok Bimbingan masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (kelompokBimbingan.success) {
        result.message = "Data kelompok bimbingan berhasil ditampilkan..."
        result.data = kelompokBimbingan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler




