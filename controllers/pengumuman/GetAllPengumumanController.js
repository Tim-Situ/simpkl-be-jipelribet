var pengumumanService = require("../../services/Pengumuman")

const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()
    var where, select, orderBy
    var status = true

    if(req.query.status){
        status = req.query.status === 'true';
    }

    where = {status}
    orderBy = {
        createdAt: 'desc'
    }

    var pengumuman = await pengumumanService.getAll(
        where, orderBy
    )

    if(pengumuman.success && pengumuman.data.length == 0){
        result.success = true
        result.message = "Data pengumuman masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (pengumuman.success) {
        result.message = "Data pengumuman berhasil ditampilkan..."
        result.data = pengumuman.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler




