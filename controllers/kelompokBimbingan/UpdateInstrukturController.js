const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")
var {AKTIF} = require("../../utils/constants")

var instrukturService = require("../../services/Instruktur")
var perusahaanService = require("../../services/Perusahaan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        id_instruktur : Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, id_instruktur } = value

    var dataKelompokBimbingan = await kelompokBimbinganService.findOne({
        id
    })

    if (!dataKelompokBimbingan.success) {
        result.success = false
        result.message = "Data kelompok bimbingan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekPerusahaan = await perusahaanService.findOne({
        username: req.username
    })

    if (!cekPerusahaan.success) {
        result.success = false
        result.message = "Terjadi kesalahan di sistem..."
        return res.status(500).json(result)
    }

    if (cekPerusahaan.data.id != dataKelompokBimbingan.data.id_perusahaan) {
        result.success = false
        result.message = "Perusahaan anda tidak memiliki hak untuk mengakses data ini"
        return res.status(403).json(result)
    }

    var cekInstruktur = await instrukturService.findOne({
        id: id_instruktur
    })

    if(!cekInstruktur.success){
        result.success = false
        result.message = "Data instruktur tidak terdaftar..."
        return res.status(400).json(result)

    }else if(cekInstruktur.success && cekInstruktur.data.id_perusahaan != cekPerusahaan.data.id){
        result.success = false
        result.message = "Data instruktur tidak terdaftar pada perusahaan ini..."
        return res.status(400).json(result)
    
    }else if(cekInstruktur.success && !cekInstruktur.data.status_aktif){
        result.success = false
        result.message = "Data instruktur sudah tidak aktif..."
        return res.status(400).json(result)
    }

    var updateKelompokBimbingan = await kelompokBimbinganService.updateData(
        {id},
        {
            id_instruktur,
            updatedBy: req.username
        }
    )

    if (updateKelompokBimbingan.success) {
        result.message = "Data kelompok bimbingan berhasil diubah..."
        result.data = updateKelompokBimbingan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler