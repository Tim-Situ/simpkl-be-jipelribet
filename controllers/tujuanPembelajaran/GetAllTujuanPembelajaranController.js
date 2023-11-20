const BaseResponse = require("../../dto/BaseResponse")

var tujuanPembelajaranService = require("../../services/TujuanPembelajaran")

async function handler(req, res) {
    var result = new BaseResponse()
    
    var tujuanPembelajaran = await tujuanPembelajaranService.getAll();

    if(tujuanPembelajaran.success && tujuanPembelajaran.data.length == 0){
        result.success = true
        result.message = "Tujuan pembelajaran masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (tujuanPembelajaran.success) {
        result.message = "Tujuan pembelajaran berhasil ditampilkan..."
        result.data = tujuanPembelajaran.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler