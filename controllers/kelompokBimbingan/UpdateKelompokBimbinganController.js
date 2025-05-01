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
        id: Joi.string().required(),
        id_siswa: Joi.string(),
        id_guru_pembimbing : Joi.string().allow(null, ''),
        id_perusahaan : Joi.string().allow(null, ''),
        id_instruktur : Joi.string().allow(null, ''),
        status: Joi.boolean().allow(null, ''),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, id_guru_pembimbing, id_perusahaan, id_instruktur, status, id_siswa } = value

    var dataKelompokBimbingan = await kelompokBimbinganService.findOne({
        id
    })

    if (!dataKelompokBimbingan.success) {
        result.success = false
        result.message = "Data kelompok bimbingan tidak ditemukan..."
        return res.status(404).json(result)
    }

    // if (id_siswa) {
    //     var cekSiswa = await siswaService.findOne({
    //         id: id_siswa
    //     })
    
    //     if(!cekSiswa.success){
    //         result.success = false
    //         result.message = "Data siswa tidak terdaftar..."
    //         return res.status(400).json(result)
    //     }

    //     if(cekSiswa.success && !cekSiswa.data.status_aktif){
    //         result.success = false
    //         result.message = "Data siswa sudah tidak aktif..."
    //         return res.status(400).json(result)
    //     }
    // }

    if (id_guru_pembimbing) {
        var cekGuruPembimbing = await guruPembimbingService.findOne({
            id: id_guru_pembimbing
        })
    
        if(!cekGuruPembimbing.success){
            result.success = false
            result.message = "Data guru pembimbing tidak terdaftar..."
            return res.status(400).json(result)
        }

        // if(cekGuruPembimbing.success && !cekGuruPembimbing.data.status_aktif){
        //     result.success = false
        //     result.message = "Data guru pembimbing sudah tidak aktif..."
        //     return res.status(400).json(result)
        // }
    }

    if (id_perusahaan) {
        var cekPerusahaan = await perusahaanService.findOne({
            id: id_perusahaan
        })
    
        if(!cekPerusahaan.success){
            result.success = false
            result.message = "Data perusahaan tidak terdaftar..."
            return res.status(400).json(result)
        }

        // if(cekPerusahaan.success && cekPerusahaan.data.status != AKTIF){
        //     result.success = false
        //     result.message = "Data perusahaan tidak aktif..."
        //     return res.status(400).json(result)
        // }

        var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
            id_siswa : dataKelompokBimbingan.data.id_siswa,
            id_perusahaan
        })
    
        if (dataKelompokBimbingan.success && cekKelompokBimbingan.data.id != dataKelompokBimbingan.data.id) {
            result.success = false
            result.message = "Siswa ini sudah pernah terdaftar pada perusahaan ini sebelumnya..."
            return res.status(400).json(result)
        }
    }

    if (id_instruktur) {
        var cekInstruktur = await instrukturService.findOne({
            id: id_instruktur
        })
    
        if(!cekInstruktur.success){
            result.success = false
            result.message = "Data instruktur tidak terdaftar..."
            return res.status(400).json(result)

        }else if(cekInstruktur.success && cekInstruktur.data.id_perusahaan != id_perusahaan && id_perusahaan != null){
            result.success = false
            result.message = "Data instruktur tidak terdaftar pada perusahaan yang dipilih..."
            return res.status(400).json(result)
        
        }else if(cekInstruktur.success && cekInstruktur.data.id_perusahaan != dataKelompokBimbingan.data.id_perusahaan && id_perusahaan == null){
            result.success = false
            result.message = "Data instruktur tidak terdaftar pada perusahaan yang dipilih..."
            return res.status(400).json(result)
        
        }else if(cekInstruktur.success && !cekInstruktur.data.status_aktif){
            result.success = false
            result.message = "Data instruktur sudah tidak aktif..."
            return res.status(400).json(result)
        }
    }

    if (status && status == true) {
        cekKelompokBimbingan = await kelompokBimbinganService.findOne({
            id_siswa: dataKelompokBimbingan.data.id_siswa,
            status: true
        })
    
        if(cekKelompokBimbingan.success){
            var nonAktifKelompokBimbingan = await kelompokBimbinganService.updateData(
                {id : cekKelompokBimbingan.data.id},
                { 

                    status: false 
                }
            )
    
            if (!nonAktifKelompokBimbingan.success) {
                result.success = false
                result.message = "Internal Server Error"
                return res.status(500).json(result)
            }
        }
    }

    var updateKelompokBimbingan = await kelompokBimbinganService.updateData(
        {id},
        {
            id_guru_pembimbing,
            id_perusahaan,
            id_instruktur,
            status,
            updatedBy: req.username
        }
    )

    if (updateKelompokBimbingan.success) {
        result.message = "Data Kelompok Bimbingan berhasil diubah..."
        result.data = updateKelompokBimbingan.data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler
