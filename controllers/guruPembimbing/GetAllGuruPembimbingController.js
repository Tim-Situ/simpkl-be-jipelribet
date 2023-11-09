var guruPembimbingService = require("../../services/GuruPembimbing")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var guruPembimbing = await guruPembimbingService.getAll()

    if(guruPembimbing.success && guruPembimbing.data.length == 0){
        result.success = true
        result.message = "Data guru pembimbing masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (guruPembimbing.success) {
        result.message = "Data guru pembimbing berhasil ditampilkan..."
        result.data = guruPembimbing.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler