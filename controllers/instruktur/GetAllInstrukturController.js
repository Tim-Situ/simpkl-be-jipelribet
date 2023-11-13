var instrukturService = require("../../services/Instruktur")
var perusahaanService = require("../../services/Perusahaan")
const BaseResponse = require("../../dto/BaseResponse")
var {ADMINSEKOLAH, PERUSAHAAN} = require("../../utils/constants")

async function handler(req, res) {
    var result = new BaseResponse()
    var where, include

    if(req.role == ADMINSEKOLAH){
        include = {
            perusahaan : {
                select : {
                    id: true,
                    nama_perusahaan: true,
                    pimpinan: true,
                    alamat: true,
                    no_hp: true,
                    email: true,
                    website: true 
                }
            },
            user : {
                select: {
                    username : true,
                    temp_password : true
                }
            }
        }
    }else{

        var perusahaan = await perusahaanService.findOne({
            username: req.username
        })
    
        if(!perusahaan.success){
            result.success = false
            result.message = "Terjadi kesalahan dalam pencarian data perusahaan..."
            result.data = []
            return res.status(400).json(result)
        }

        where = {
            id_perusahaan: perusahaan.data.id
        }

        include = {
            user : {
                select: {
                    username : true,
                    temp_password : true
                }
            }
        }
    }

    var instruktur = await instrukturService.getAll(
        where, include
    )

    if(instruktur.success && instruktur.data.length == 0){
        result.success = true
        result.message = "Data instruktur masih kosong..."
        result.data = []
        return res.status(200).json(result)
    }

    if (instruktur.success) {
        result.message = "Data instruktur berhasil ditampilkan..."
        result.data = instruktur.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler