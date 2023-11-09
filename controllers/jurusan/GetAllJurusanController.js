var Joi = require("joi")

var jurusanService = require("../../services/Jurusan")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var jurusan = await jurusanService.getAll()

    if(jurusan.success && jurusan.data.length == 0){
        result.success = true
        result.message = "Data jurusan masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (jurusan.success) {
        result.message = "Data jurusan berhasil ditampilkan..."
        result.data = jurusan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler