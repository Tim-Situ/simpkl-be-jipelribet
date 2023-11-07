var Joi = require("joi")

var userService = require("../../services/Users")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        username : Joi.string().max(50).required(),
        password : Joi.string().max(10).required(),
        nama : Joi.string().max(100).required(),
        alamat : Joi.string().required(),
        no_hp : Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { username, nama, alamat, no_hp } = value
    var role = "ADMINSEKOLAH"

    var newAdminSekolah = await userService.registerAdminSekolah({
        username,
        nama,
        alamat,
        no_hp
    })

    if (!newAdminSekolah.success) {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }

    var newUser = await userService.createUser({
        username,
        password,
        role
    })

    if (newUser) {
        result.data = newAdminSekolah.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler