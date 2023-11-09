var siswaService = require("../../services/Siswa")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var siswa = await siswaService.getAll()

    if(siswa.success && siswa.data.length == 0){
        result.success = true
        result.message = "Data siswa masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (siswa.success) {
        result.message = "Data siswa berhasil ditampilkan..."
        result.data = siswa.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler