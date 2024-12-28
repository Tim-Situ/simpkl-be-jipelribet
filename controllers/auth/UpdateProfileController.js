var Joi = require("joi")
var bcrypt = require("bcrypt")
const BaseResponse = require("../../dto/BaseResponse")
const cekPassword = require("../../dto/CekPasswordValid")
var siswaService = require("../../services/Siswa")
var uploadFile = require("../../dto/ManageFile")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        nama : Joi.string().max(100).allow(null, ''),
        alamat : Joi.string().allow(null, ''),
        no_hp : Joi.string().max(20).allow(null, ''),
        tempat_lahir : Joi.string().max(100).allow(null, ''),
        tanggal_lahir : Joi.date().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { nama, alamat, no_hp, tempat_lahir, tanggal_lahir } = value

    var dataSiswa = await siswaService.findOne({
        nisn : req.username
    })

    if(!dataSiswa.success){
        result.success = false
        result.message = "Terjadi kesalahan dalam sistem..."
        return res.status(500).json(result)
    }

    var foto = dataSiswa.data.foto;
    
    if(req.file) {
        try {
            foto = await uploadFile.uploadImageToAzure(req.file);
            console.log(foto)
        } catch (error) {
            result.success = false
            result.message = "Terjadi kesalahan saat upload foto"
            return res.status(500).json(result)
        }
    }

    var updateSiswa = await siswaService.updateData(
        {nisn : req.username},
        {
            nama,
            alamat,
            no_hp,
            tempat_lahir,
            tanggal_lahir,
            foto
        }
    )

    if (updateSiswa.success) {
        result.message = "Data profile berhasil diubah..."
        result.data = updateSiswa.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler