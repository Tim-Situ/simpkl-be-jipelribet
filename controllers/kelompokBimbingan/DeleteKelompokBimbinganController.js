const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var kelompokBimbinganService = require("../../services/KelompokBimbingan")
var absensiService = require("../../services/Absensi")
var jurnalHarianService = require("../../services/JurnalHarian")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id } = value

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id
    })

    if (!cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Data Kelompok Bimbingan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekAbsensi = await absensiService.findOne({
        id_bimbingan: cekKelompokBimbingan.data.id
    })

    var cekJurnalHarian = await jurnalHarianService.findOne({
        id_bimbingan: cekKelompokBimbingan.data.id
    })

    if (cekAbsensi.success || cekJurnalHarian.success) {
        result.success = false
        result.message = "Data ini masih menyimpan data absensi atau jurnal harian siswa..."
        return res.status(400).json(result)
    }

    var deletekelompokBimbingan = await kelompokBimbinganService.deleteData({
        id
    })

    if (deletekelompokBimbingan.success) {
        result.message = "Data kelompok bimbingan berhasil dihapus..."
        return res.status(200).json(result)
        
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler