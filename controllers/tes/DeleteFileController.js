var Joi = require("joi")

const BaseResponse = require("../../dto/BaseResponse")
var uploadFile = require("../../dto/ManageFile")

async function handler(req, res) {
    var result = new BaseResponse()

    const url = "https://tplum.is3.cloudhost.id/jurnalHarian/565345650/1700555039.png"

    const lastSlashIndex = url.lastIndexOf('/');
    const fileName2 = url.substring(lastSlashIndex + 1);

    try {
        const deleteFile = await uploadFile.deleteImageFromS3("565345650", fileName2)

        console.log(deleteFile)

        return null;

    } catch (error) {
        result.success = false
        result.message = "Terjadi kesalahan saat delete foto"
        return res.status(500).json(result)
    }
}

module.exports = handler