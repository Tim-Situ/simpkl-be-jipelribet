var Joi = require("joi")
var userService = require("../../services/Users")
var instrukturService = require("../../services/Instruktur")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        username : Joi.string().max(100).allow(null, ''),
        nama : Joi.string().max(100).allow(null, ''),
        no_hp : Joi.string().max(25).allow(null, ''),
        status_aktif : Joi.boolean()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, username, nama, no_hp, status_aktif } = value

    var dataInstruktur = await instrukturService.findOne({
        id
    })

    if (!dataInstruktur.success) {
        result.success = false
        result.message = "Data instruktur tidak ditemukan..."
        return res.status(404).json(result)
    }

    if(username != null){
        var cekUsername = await userService.findUser({ 
            username
        })

        if(cekUsername.success && cekUsername.data.username != dataInstruktur.data.username){
            result.success = false
            result.message = "Username sudah digunakan..."
            return res.status(400).json(result)
        }

        var updateUser = await userService.updateUser(
            { username : dataInstruktur.data.username},
            {
                username,
                updatedBy : req.username
            }
        )

        if (!updateUser.success) {
            result.success = false
            result.message = "Internal Server Error"
            res.status(500).json(result)
        }
    }
    
    var updateInstruktur = await instrukturService.updateData(
        {id},
        {
            username,
            nama,
            no_hp,
            status_aktif,
            updatedBy : req.username
        }
    )

    if (updateInstruktur.success) {
        result.message = "Data Instruktur berhasil diubah..."
        result.data = updateInstruktur.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler