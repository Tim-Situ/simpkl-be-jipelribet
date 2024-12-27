var Joi = require("joi")
const BaseResponse = require("../../dto/BaseResponse")
const {AKTIF, NONAKTIF, REJECT} = require("../../utils/constants")
var uploadFile = require("../../dto/ManageFile")

var userService = require("../../services/Users")
var perusahaanService = require("../../services/Perusahaan")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        username : Joi.string().max(20).allow(null, ''),
        nama_perusahaan : Joi.string().max(100).allow(null, ''),
        pimpinan : Joi.string().max(100).allow(null, ''),
        alamat : Joi.string().allow(null, ''),
        no_hp : Joi.string().max(25).allow(null, ''),
        email : Joi.string().allow(null, ''),
        website : Joi.string().allow(null, ''),
        status : Joi.string().valid(AKTIF, NONAKTIF, REJECT).allow(null, ''),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, username, nama_perusahaan, pimpinan, alamat, no_hp, email, website, status } = value

    var dataPerusahaan = await perusahaanService.findOne({
        id
    })

    if (!dataPerusahaan.success) {
        result.success = false
        result.message = "Data perusahaan tidak ditemukan..."
        return res.status(404).json(result)
    }

    if(username != null){
        var cekUsername = await userService.findUser({ 
            username
        })

        if(cekUsername.success && cekUsername.data.username != dataPerusahaan.data.username){
            result.success = false
            result.message = "Username sudah digunakan..."
            return res.status(400).json(result)
        }
    }

    var foto = dataPerusahaan.data.foto;

    if(req.file) {
        try {
            foto = await uploadFile.uploadImageToAzure(req.file);

            const url = dataPerusahaan.data.foto

            const deleteFile = await uploadFile.deleteImageFromAzure(url)
    
        } catch (error) {
            result.success = false
            result.message = "Terjadi kesalahan saat upload foto"
            return res.status(500).json(result)
        }
    }

    var updateUser = await userService.updateUser(
        { username : dataPerusahaan.data.username},
        {
            username,
            updatedBy : req.username
        }
    )

    if (!updateUser.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
    
    var updatePerusahaan = await perusahaanService.updateData(
        {id},
        {
            username,
            nama_perusahaan,
            pimpinan,
            alamat,
            no_hp,
            email,
            website,
            status,
            foto,
            updatedBy : req.username
        }
    )

    if (updatePerusahaan.success) {
        result.message = "Data perusahaan berhasil diubah..."
        result.data = updatePerusahaan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler