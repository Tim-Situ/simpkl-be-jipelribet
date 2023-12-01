const BaseResponse = require("../../dto/BaseResponse")

var aspekPenilaianService = require("../../services/AspekPenilaian")

async function handler(req, res) {
    var result = new BaseResponse()
    
    var aspekPenilaian = await aspekPenilaianService.getAll();

    if(aspekPenilaian.success && aspekPenilaian.data.length == 0){
        result.success = true
        result.message = "Aspek penilaian masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (aspekPenilaian.success) {
        result.message = "Aspek penilaian berhasil ditampilkan..."
        result.data = aspekPenilaian.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler