
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var username = "famuwa"

    result.message = "Hallo " + username
    result.data = username

    res.json(result)
}

module.exports = handler