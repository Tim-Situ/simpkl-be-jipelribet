var Joi = require("joi")
var bannerService = require("../../services/Banner")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        gambar: Joi.string().required(),
        link: Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { gambar, link } = value

    var newData = await bannerService.createNew({
        gambar,
        link
    })

    if (newData.success) {
        result.message = "Data banner berhasil ditambahkan..."
        result.data = newData.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler