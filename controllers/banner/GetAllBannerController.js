var bannerService = require("../../services/Banner")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var banner = await bannerService.getAll()

    if(banner.success && banner.data.length == 0){
        result.success = true
        result.message = "Data banner masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (banner.success) {
        result.message = "Data banner berhasil ditampilkan..."
        result.data = banner.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler