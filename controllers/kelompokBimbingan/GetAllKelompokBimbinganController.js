var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var tahunAjaranService = require("../../services/TahunAjaran")

const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()
    var where, select, orderBy

    var tahunAjaran = await tahunAjaranService.findOne({
        status: true
    })

    if(!tahunAjaran.success){
        result.success = false
        result.message = "Terjadi kesalahan di sistem..."
        return res.status(500).json(result)
    }

    where = {
        id_tahun_ajaran: tahunAjaran.data.id
    }
    select = {
        id: true,
        status: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
        siswa : {
            include: {
                jurusan: true
            }
        },
        guru_pembimbing : true,
        instruktur: true,
        perusahaan: true,
        tahun_ajaran: true
    }
    orderBy = {
        status: 'desc'
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




