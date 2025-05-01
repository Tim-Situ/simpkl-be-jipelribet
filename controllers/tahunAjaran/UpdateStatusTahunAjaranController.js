var Joi = require("joi")
var tahunAjaranService = require("../../services/TahunAjaran")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().max(100).required(),
        status : Joi.boolean().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, status } = value

    var tahunAjaran = await tahunAjaranService.findOne({
        id
    })

    if (!tahunAjaran.success) {
        result.success = false
        result.message = "Data tahun ajaran tidak ditemukan..."
        return res.status(404).json(result)
    }

    // if(status == true){
    //     var tahunAjaranAktif = await tahunAjaranService.findOne({
    //         status : true
    //     })
    
    //     if (tahunAjaranAktif.success) {
    //         var nonAktifTahunAjaran = await tahunAjaranService.updateStatus(
    //             tahunAjaranAktif.data.id,
    //             {
    //                 status : false,
    //                 updatedBy : req.username
    //             }
    //         )
    
    //         if (!nonAktifTahunAjaran.success) {
    //             result.success = false
    //             result.message = "Internal Server Error"
    //             return res.status(500).json(result)
    //         }
    //     }
    // }

    var updatedStatusTahunAjaran = await tahunAjaranService.updateStatus(
        tahunAjaran.data.id,
        {
            status,
            updatedBy : req.username
        }
    )

    if (updatedStatusTahunAjaran.success) {
        result.message = "Status tahun ajaran berhasil diubah..."
        result.data = updatedStatusTahunAjaran.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler