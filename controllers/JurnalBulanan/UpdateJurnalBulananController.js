const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var uploadFile = require("../../dto/ManageFile")

var jurnalBulananService = require("../../services/JurnalBulanan")
var siswaService = require("../../services/Siswa")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

async function handler (req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required(),
        pencapaian: Joi.string().allow(null, ''),
        kendala: Joi.string().allow(null, ''),
        rencana_perbaikan: Joi.string().allow(null, ''),
        refleksi: Joi.string().allow(null, ''),
        pembimbing: Joi.string().allow(null, '')
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id, pencapaian, kendala, rencana_perbaikan, refleksi, pembimbing } = value

    var cekJurnalBulanan = await jurnalBulananService.findOne({
        id
    })

    if (!cekJurnalBulanan.success) {
        result.success = false
        result.message = "Data Jurnal Bulanan tidak ditemukan..."
        return res.status(404).json(result)
    }

    var id_bimbingan = cekJurnalBulanan.data.id_bimbingan

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
        result.message = "Anda tidak memiliki akses untuk mengubah jurnal bulanan ini..."
        return res.status(403).json(result)
    }

    if(req.file) {
        try {
            const dokumenUrl = await uploadFile.uploadDocumentToAzure(req.file);
        
            var updateDokumen = await jurnalBulananService.updateData(
                id,
                {
                    dokumen: dokumenUrl
                }
            )
        
            if (!updateDokumen.success){
                result.success = false
                result.message = "Internal Server Error"
                res.status(500).json(result)
            }

            const url = cekJurnalBulanan.data.dokumen
            console.log(url)

            const deleteFile = await uploadFile.deleteDocumentFromAzure(url)
    
        } catch (error) {
            result.success = false
            result.message = "Terjadi kesalahan saat upload dokumen"
            return res.status(500).json(result)
        }
    }

    var updatedData = await jurnalBulananService.updateData(
        id,
        {
            pencapaian,
            kendala,
            rencana_perbaikan,
            refleksi,
            pembimbing,
            status: "MENUNGGU",
            updatedBy: req.username
        }
    )

    if (updatedData.success) {
        result.message = "Jurnal bulanan berhasil diubah..."
        result.data = updatedData.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler