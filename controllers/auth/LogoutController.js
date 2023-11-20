var Joi = require("joi")
var bcrypt = require("bcrypt")
var jwt = require("jsonwebtoken")  

var userService = require("../../services/Users")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204)

    var user = await userService.findUser(
        { refresh_token: refreshToken }
    )

    if(!user.success){
        return res.sendStatus(204)
    }

    var updateUser = await userService.updateUser(
        {id: user.data.id},
        {refresh_token: null}
    )

    if (updateUser.success) {
        res.clearCookie('refreshToken')
        result.message = "Logout berhasil..."
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler