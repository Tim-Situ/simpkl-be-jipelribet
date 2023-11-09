var Joi = require("joi")

var tahunAjaranService = require("../../services/TahunAjaran")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var tahunAjaran = await tahunAjaranService.getAll()

    if(tahunAjaran.success && tahunAjaran.data.length == 0){
        result.success = true
        result.message = "Data masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (tahunAjaran.success) {
        result.message = "Data tahun ajaran berhasil ditampilkan..."
        result.data = tahunAjaran.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler