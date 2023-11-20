const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()
    
    if ( !req.query.siswa || !req.query.bulan || !req.query.tahun ) {
        result.success = false
        result.message = "Parameter siswa, bulan dan tahun harus diisi..."
        return res.status(400).json(result)
    }
    
    var id_siswa = req.query.siswa
    var bulan = req.query.bulan
    var tahun = req.query.tahunnh

    result.success = true
    result.message = {
        id_siswa,
        bulan,
        tahun,
    }

    return res.status(400).json(result)
}

module.exports = handler