var Joi = require("joi")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")  

var userService = require("../../services/Users")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        username : Joi.string().required(),
        password : Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var {username, password} = value

    var dataUser = await userService.findUser({
        username
    })

    if(!dataUser.success){
        result.success = false
        result.message = "wrong username or password"
        return res.status(404).json(result)
    }

    const match = await bcrypt.compare(password, dataUser.data.password)
    if(!match){
        result.success = false
        result.message = "wrong username or password"
        return res.status(400).json(result)
    }

    const userId = dataUser.data.id
    username = dataUser.data.username
    const role = dataUser.data.role

    const accessToken = jwt.sign({userId, username, role}, process.env.ACCESS_TOKEN_SECRET)

    result.message = "Login berhasil..."
    result.data = {
        accessToken
    }
    res.json(result)
}

module.exports = handler