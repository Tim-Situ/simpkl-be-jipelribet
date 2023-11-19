var Joi = require("joi")
var bcrypt = require("bcrypt")
var userService = require("../../services/Users")
var perusahaanService = require("../../services/Perusahaan")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        username : Joi.string().max(20).allow(null, ''),
        //password : Joi.string().max(10).allow(null, ''),
        nama_perusahaan : Joi.string().max(100).allow(null, ''),
        pimpinan : Joi.string().max(100).allow(null, ''),
        alamat : Joi.string().allow(null, ''),
        no_hp : Joi.string().max(25).allow(null, ''),
        email : Joi.string().allow(null, ''),
        website : Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { username, nama_perusahaan, pimpinan, alamat, no_hp, email, website } = value

    var dataPerusahaan = await perusahaanService.findOne({
        username: req.username
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

        if(cekUsername.success && cekUsername.data.username != req.username){
            result.success = false
            result.message = "Username sudah digunakan..."
            return res.status(400).json(result)
        }
    }

    var updateUser = await userService.updateUser(
        { username : req.username},
        {
            username,
            updatedBy : username
        }
    )

    if (!updateUser.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
    
    var updatePerusahaan = await perusahaanService.updateData(
        {username : req.username},
        {
            username,
            nama_perusahaan,
            pimpinan,
            alamat,
            no_hp,
            email,
            website
        }
    )

    if (updatePerusahaan.success) {
        result.message = "Data Profile berhasil diubah..."
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler