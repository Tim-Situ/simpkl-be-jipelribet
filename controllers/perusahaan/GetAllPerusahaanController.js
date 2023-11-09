var Joi = require("joi")

var perusahaanService = require("../../services/Perusahaan")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var perusahaan = await perusahaanService.getAll()

    if(perusahaan.success && perusahaan.data.length == 0){
        result.success = true
        result.message = "Data perusahaan masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (perusahaan.success) {
        result.message = "Data perusahaan berhasil ditampilkan..."
        result.data = perusahaan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler