var jwt = require("jsonwebtoken")  

var userService = require("../../services/Users")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        result.success = false
        result.message = "Unauthorized"
        return res.status(401).json(result)
    }

    var dataUser = await userService.findUser({
        refresh_token: refreshToken
    })

    if(!dataUser.success){
        result.success = false
        result.message = "Forbidden..."
        return res.status(403).json(result)
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err){
            result.success = false
            result.message = "Forbidden..."
            return res.status(403).json(result)
        }

        const userId = dataUser.data.id
        const username = dataUser.data.username
        const role = dataUser.data.role

        const accessToken = jwt.sign({userId, username, role}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s' // 15s
        })

        result.message = "Berhasil generate refresh token..."
        result.data = {
            accessToken
        }
        res.json(result)
    })
}

module.exports = handler