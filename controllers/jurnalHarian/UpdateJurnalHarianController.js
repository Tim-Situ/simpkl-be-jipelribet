const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var uploadFile = require("../../dto/ManageFile")

var jurnalHarianService = require("../../services/JurnalHarian")
var siswaService = require("../../services/Siswa")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

async function handler (req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        jenis_pekerjaan: Joi.string().allow(null, ''),
        deskripsi_pekerjaan: Joi.string().allow(null, ''),
        bentuk_kegiatan: Joi.string().allow(null, ''),
        jam_mulai: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null, ''),
        jam_selesai: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).allow(null, ''),
        staf: Joi.string().allow(null, ''),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, jenis_pekerjaan, deskripsi_pekerjaan, bentuk_kegiatan, jam_mulai, jam_selesai, staf } = value

    var cekJurnalHarian = await jurnalHarianService.findOne({
        id
    })

    if (!cekJurnalHarian.success) {
        result.success = false
        result.message = "Data Jurnal Harian tidak ditemukan..."
        return res.status(404).json(result)
    }

    var id_bimbingan = cekJurnalHarian.data.id_bimbingan

    var cekKelompokBimbingan = await kelompokBimbinganService.findOne({
        id: id_bimbingan
    })

    var id_siswa = cekKelompokBimbingan.data.id_siswa
    
    var cekSiswa = await siswaService.findOne({
        nisn: req.username
    })

    var user_id = cekSiswa.data.id

    if (id_siswa !== user_id) {
        result.success = false
        result.message = "Anda tidak memiliki akses untuk mengubah jurnal harian ini..."
        return res.status(403).json(result)
    }

    var startTime;
    var endTime;
    
    if (jam_mulai) {
        startTime = new Date();
        var [hour, minute, second] = jam_mulai.split(':');
        startTime.setUTCHours(parseInt(hour), parseInt(minute), parseInt(second));
    }

    if (jam_selesai) {
        endTime = new Date();
        var [hour, minute, second] = jam_selesai.split(':');
        endTime.setUTCHours(parseInt(hour), parseInt(minute), parseInt(second));
    }

    if(req.file) {
        try {
            const fotoUrl = await uploadFile.uploadImageToS3(req.file, req.username);
        
            var updateFoto = await jurnalHarianService.updateData(
                id,
                {
                    foto : fotoUrl
                }
            )
        
            if (!updateFoto.success){
                result.success = false
                result.message = "Internal Server Error"
                res.status(500).json(result)
            }

            const url = cekJurnalHarian.data.foto
            const lastSlashIndex = url.lastIndexOf('/');
            const fileName2 = url.substring(lastSlashIndex + 1);

            const deleteFile = await uploadFile.deleteImageFromS3(req.username, fileName2)
    
        } catch (error) {
            result.success = false
            result.message = "Terjadi kesalahan saat upload foto"
            return res.status(500).json(result)
        }
    }

    var updatedData = await jurnalHarianService.updateData(
        id,
        {
            jenis_pekerjaan,
            deskripsi_pekerjaan,
            bentuk_kegiatan, 
            jam_mulai : startTime,
            jam_selesai : endTime, 
            staf,
            updatedBy: req.username
        }
    )

    if (updatedData.success) {
        result.message = "Jurnal harian berhasil diubah..."
        result.data = updatedData.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler