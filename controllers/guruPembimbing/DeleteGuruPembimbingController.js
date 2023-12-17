const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var guruPembimbingService = require("../../services/GuruPembimbing")
var userService = require("../../services/Users")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

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

    var cekGuruPembimbing = await guruPembimbingService.findOne({
        id
    })

    if (!cekGuruPembimbing.success) {
        result.success = false
        result.message = "Data Guru Pembimbing tidak ditemukan..."
        return res.status(404).json(result)
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id_guru_pembimbing: cekGuruPembimbing.data.id
    })

    if (cekKelompokBimbingan.success) {
        result.success = false
        result.message = "Data guru pembimbing masih ada dalam kelompok bimbingan!!!"
        return res.status(400).json(result)
    }

    var deleteDataPembimbing = await guruPembimbingService.deleteData({
        id
    })

    var deleteDataUser = await userService.deleteData({
        username: cekGuruPembimbing.data.nip
    })

    if (deleteDataPembimbing.success && deleteDataUser.success) {
        result.message = "Data guru pembimbing berhasil dihapus..."
        return res.status(200).json(result)
        
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler