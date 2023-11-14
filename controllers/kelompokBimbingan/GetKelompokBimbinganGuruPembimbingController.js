const BaseResponse = require("../../dto/BaseResponse")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var guruPembimbingService = require("../../services/GuruPembimbing")
var tahunAjaranService = require("../../services/TahunAjaran")

async function handler(req, res) {
    var result = new BaseResponse()
    var where, select, orderBy

    var guruPembimbing = await guruPembimbingService.findOne({
        nip: req.username
    })

    if(!guruPembimbing.success){
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

    where = {
        id_guru_pembimbing: guruPembimbing.data.id,
        id_tahun_ajaran: tahunAjaran.data.id
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
        instruktur: true,
        perusahaan: true,
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




