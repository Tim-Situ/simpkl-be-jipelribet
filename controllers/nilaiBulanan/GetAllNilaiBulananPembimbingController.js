const BaseResponse = require("../../dto/BaseResponse")

var nilaiBulananService = require("../../services/NilaiBulanan")
var guruPembimbingService = require("../../services/GuruPembimbing")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

async function handler(req, res) {
    var result = new BaseResponse()
    
    if ( !req.query.id_bimbingan || !req.query.bulan || !req.query.tahun ) {
        result.success = false
        result.message = "Parameter bimbingan, bulan dan tahun harus diisi..."
        return res.status(400).json(result)
    }
    
    var id_bimbingan = req.query.id_bimbingan
    var bulan = parseInt(req.query.bulan)
    var tahun = parseInt(req.query.tahun)

    var dataPembimbing = await guruPembimbingService.findOne({
        nip: req.username
    })

    if (!dataPembimbing.success) {
        result.success = false
        result.message = "Terjadi kesalahan dalam sistem..."
        return res.status(500).json(result)
    }

    var cekBimbingan = await kelompokBimbinganService.findOne({
        id: id_bimbingan
    })

    if (!cekBimbingan.success) {
        result.success = false
        result.message = "Data kelompok bimbingan tidak ditemukan..."
        return res.status(404).json(result)
    }

    if (cekBimbingan.data.id_guru_pembimbing != dataPembimbing.data.id) {
        result.success = false
        result.message = "Anda tidak memiliki hak untuk mengakses nilai ini..."
        return res.status(403).json(result)
    }

    if (!cekBimbingan.data.status) {
        result.success = false
        result.message = "Kelompok bimbingan sudah tidak aktif..."
        return res.status(400).json(result)
    }

    var where = {
        AND: [
            { id_bimbingan: cekBimbingan.data.id },
            { bulan: bulan },
            { tahun: tahun },
        ]
    }

    var orderBy = [
        { bulan: 'desc' },
        { tahun: 'desc' }
    ]

    var include = {
        tujuan_pembelajaran: true
    }

    var nilaiBulanan = await nilaiBulananService.getAll(
        where,
        orderBy,
        include
    )

    if (nilaiBulanan.success && nilaiBulanan.data.length === 0) {
        result.message = "Data nilai bulanan masih kosong..."
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