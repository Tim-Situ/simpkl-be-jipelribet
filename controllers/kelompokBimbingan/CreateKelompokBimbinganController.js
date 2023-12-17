const BaseResponse = require("../../dto/BaseResponse")
var Joi = require("joi")

var {AKTIF} = require("../../utils/constants")

var siswaService = require("../../services/Siswa")
var guruPembimbingService = require("../../services/GuruPembimbing")
var instrukturService = require("../../services/Instruktur")
var perusahaanService = require("../../services/Perusahaan")
var tahunAjaranService = require("../../services/TahunAjaran")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")


async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id_siswa : Joi.string().required(),
        id_guru_pembimbing : Joi.string().required(),
        id_perusahaan : Joi.string().required(),
        id_instruktur : Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id_siswa, id_guru_pembimbing, id_perusahaan, id_instruktur } = value

    var status = true;

    var cekSiswa = await siswaService.findOne({
        id: id_siswa
    })

    if(!cekSiswa.success){
        result.success = false
        result.message = "Data siswa tidak terdaftar..."
        return res.status(400).json(result)
    }

    if(cekSiswa.success && !cekSiswa.data.status_aktif){
        result.success = false
        result.message = "Data siswa sudah tidak aktif..."
        return res.status(400).json(result)
    }

    var cekGuruPembimbing = await guruPembimbingService.findOne({
        id: id_guru_pembimbing
    })

    if(!cekGuruPembimbing.success){
        result.success = false
        result.message = "Data guru pembimbing tidak terdaftar..."
        return res.status(400).json(result)
    }

    if(cekGuruPembimbing.success && !cekGuruPembimbing.data.status_aktif){
        result.success = false
        result.message = "Data guru pembimbing sudah tidak aktif..."
        return res.status(400).json(result)
    }

    var cekPerusahaan = await perusahaanService.findOne({
        id: id_perusahaan
    })

    if(!cekPerusahaan.success){
        result.success = false
        result.message = "Data perusahaan tidak terdaftar..."
        return res.status(400).json(result)
    }

    if(cekPerusahaan.success && cekPerusahaan.data.status != AKTIF){
        result.success = false
        result.message = "Data perusahaan tidak aktif..."
        return res.status(400).json(result)
    }

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id_siswa,
        id_perusahaan
    })

    if(cekKelompokBimbingan.success){
        result.success = false
        result.message = "Data siswa sudah terdaftar sebelumnya pada perusahaan yang dipilih..."
        return res.status(400).json(result)
    }

    cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id_siswa
    })

    if(cekKelompokBimbingan.success){
        status = false
    }


    if (id_instruktur) {
        var cekInstruktur = await instrukturService.findOne({
            id: id_instruktur
        })
    
        if(!cekInstruktur.success){
            result.success = false
            result.message = "Data instruktur tidak terdaftar..."
            return res.status(400).json(result)

        }else if(cekInstruktur.success && cekInstruktur.data.id_perusahaan != id_perusahaan){
            result.success = false
            result.message = "Data instruktur tidak terdaftar pada perusahaan yang dipilih..."
            return res.status(400).json(result)
        
        }else if(cekInstruktur.success && !cekInstruktur.data.status_aktif){
            result.success = false
            result.message = "Data instruktur sudah tidak aktif..."
            return res.status(400).json(result)
        }
    }

    var tahunAjaran = await tahunAjaranService.findOne({
        status: true
    })

    if(!tahunAjaran.success){
        result.success = false
        result.message = "Internal Server Error..."
        return res.status(500).json(result)
    }

    var newKelompokBimbingan = await kelompokBimbinganService.createNew({
        id_siswa,
        id_guru_pembimbing,
        id_perusahaan,
        id_instruktur,
        id_tahun_ajaran: tahunAjaran.data.id,
        status,
        createdBy: req.username
    })

    if (newKelompokBimbingan.success) {
        result.message = "Kelompok bimbingan berhasil ditambahkan..."
        result.data = newKelompokBimbingan.data
        res.json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler