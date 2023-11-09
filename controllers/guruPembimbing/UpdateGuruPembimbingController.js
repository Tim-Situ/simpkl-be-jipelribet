var Joi = require("joi")
var userService = require("../../services/Users")
var guruPembimbingService = require("../../services/GuruPembimbing")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().max(100).required(),
        nip : Joi.string().max(50).allow(null, ''),
        nama : Joi.string().max(100).allow(null, ''),
        alamat : Joi.string().allow(null, ''),
        no_hp : Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, nip, nama, alamat, no_hp } = value

    var dataGuruPembimbing = await guruPembimbingService.findOne({
        id
    })

    if (!dataGuruPembimbing.success) {
        result.success = false
        result.message = "Data guru pembimbing tidak ditemukan..."
        return res.status(404).json(result)
    }

    if(nip != null){
        var cekNip = await userService.findUser({ 
            username : nip
        })

        if(cekNip.success && cekNip.data.username != dataGuruPembimbing.data.nip){
            result.success = false
            result.message = "NIP sudah digunakan..."
            return res.status(400).json(result)
        }

        var updateUser = await userService.updateUser(
            { username : dataGuruPembimbing.data.nip},
            {
                username : nip,
                updatedBy : req.username
            }
        )

        if (!updateUser.success) {
            result.success = false
            result.message = "Internal Server Error"
            res.status(500).json(result)
        }
    }
    
    var updateGuruPembimbing = await guruPembimbingService.updateData(
        {id},
        {
            nip,
            nama,
            alamat,
            no_hp,
            updatedBy : req.username
        }
    )

    if (updateGuruPembimbing.success) {
        result.message = "Data guru pembimbing berhasil diubah..."
        result.data = updateGuruPembimbing.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler