var Joi = require("joi")

const BaseResponse = require("../../dto/BaseResponse")

var jurnalHarianService = require("../../services/JurnalHarian")
var instrukturService = require("../../services/Instruktur")
var kelompokPembimbingService = require("../../services/KelompokBimbingan")

async function handler(req, res) {
    var result = new BaseResponse()
    
    var schema = Joi.object({
        id: Joi.string().required(),
        catatan_instruktur: Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, catatan_instruktur } = value

    var cekJurnalHarian = await jurnalHarianService.findOne({
        id
    })

    if (!cekJurnalHarian.success) {
        result.success = false
        result.message = "Data jurnal harian tidak ditemukan..."
        return res.status(404).json(result)
    }

    var id_bimbingan = cekJurnalHarian.data.id_bimbingan

    var cekKelompokBimbingan = await kelompokPembimbingService.findOne({
        id: id_bimbingan
    })

    var id_instruktur = cekKelompokBimbingan.data.id_instruktur

    var cekInstruktur = await instrukturService.findOne({
        username: req.username
    })

    var user_id = cekInstruktur.data.id

    if (id_instruktur !== user_id) {
        result.success = false
        result.message = "Anda tidak memiliki akses ke jurnal ini..."
        //result.data = id_instruktur + " " + user_id
        return res.status(403).json(result)
    }

    var createCatatanInstruktur = await jurnalHarianService.updateData(
        id,
        {
            catatan_instruktur,
            updatedBy: req.username
        }
    )

    if (createCatatanInstruktur.success) {
        result.message = "Catatan instruktur berhasil ditambahkan..."
        result.data = createCatatanInstruktur.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler