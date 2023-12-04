const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi");

var guruPembimbingService = require("../../services/GuruPembimbing")
var kelompokBimbinganService = require("../../services/KelompokBimbingan");
var absensiService = require("../../services/Absensi");

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        tanggal: Joi.date().required(),
        data: Joi.array().items(
            Joi.object({
                id_bimbingan: Joi.string().required(),
                status: Joi.string().uppercase().valid('HADIR', 'LIBUR', 'SAKIT', 'ALPA', 'IZIN').required(),
            })
        ),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }
    
    var { tanggal, data } = value

    var cekGuruPembimbing = await guruPembimbingService.findOne({
        nip: req.username
    })

    var user_id = cekGuruPembimbing.data.id

    for (const element of data) {
        var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
            id: element.id_bimbingan
        })

        if (!cekKelompokBimbingan.success) {
            result.success = false
            result.message = "Salah satu data bimbingan tidak ditemukan..."
            return res.status(404).json(result)
        }

        var id_guru_pembimbing = cekKelompokBimbingan.data.id_guru_pembimbing

        if (id_guru_pembimbing !== user_id) {
            result.success = false
            result.message = "Anda tidak bisa mengakses salah satu data bimbingan..."
            return res.status(403).json(result)
        }
    };

    var createdAbsensi = await absensiService.createBulk({
        tanggal,
        absensi: data
    })

    if (createdAbsensi.success) {
        result.success = true
        result.message = "Absensi bimbingan berhasil disimpan..."
        result.data = createdAbsensi.data
        return res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler