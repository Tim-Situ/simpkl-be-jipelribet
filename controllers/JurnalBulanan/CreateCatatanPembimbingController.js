var Joi = require("joi")

const BaseResponse = require("../../dto/BaseResponse")

var jurnalBulananService = require("../../services/JurnalBulanan")
var guruPembimbingService = require("../../services/GuruPembimbing")
var kelompokPembimbingService = require("../../services/KelompokBimbingan")

async function handler(req, res) {
    var result = new BaseResponse()
    
    var schema = Joi.object({
        id: Joi.string().required(),
        catatan_pembimbing: Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, catatan_pembimbing } = value

    var cekJurnalBulanan = await jurnalBulananService.findOne({
        id
    })

    if (!cekJurnalBulanan.success) {
        result.success = false
        result.message = "Data jurnal bulanan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var id_bimbingan = cekJurnalBulanan.data.id_bimbingan

    var cekKelompokBimbingan = await kelompokPembimbingService.findOne({
        id: id_bimbingan
    })

    var id_guru_pembimbing = cekKelompokBimbingan.data.id_guru_pembimbing

    var cekGuruPembimbing = await guruPembimbingService.findOne({
        nip: req.username
    })

    var user_id = cekGuruPembimbing.data.id

    if (id_guru_pembimbing !== user_id) {
        result.success = false
        result.message = "Anda tidak memiliki akses ke jurnal bulanan ini..."
        return res.status(403).json(result)
    }

    var createCatatanPembimbing = await jurnalBulananService.updateData(
        id,
        {
            catatan_pembimbing,
            updatedBy: req.username
        }
    )

    if (createCatatanPembimbing.success) {
        result.message = "Catatan pembimbing untuk jurnal bulanan berhasil ditambahkan..."
        result.data = createCatatanPembimbing.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler