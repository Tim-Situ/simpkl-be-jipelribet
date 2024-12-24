var Joi = require("joi")
var bcrypt = require("bcrypt")
const BaseResponse = require("../../dto/BaseResponse")
const cekPassword = require("../../dto/CekPasswordValid")
var userService = require("../../services/Users")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        token : Joi.string().required(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { token } = value

    var dataUser = await userService.findUser({
        username : req.username
    })

    if(!dataUser.success){
        result.success = false
        result.message = "Terjadi kesalahan dalam sistem..."
        return res.status(500).json(result)
    }

    var updateTokenMessage = await userService.updateUser(
        {username : req.username},
        {
            message_token: token
        }
    )

    if (updateTokenMessage.success) {
        result.message = "Message token berhasil disimpan..."
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler