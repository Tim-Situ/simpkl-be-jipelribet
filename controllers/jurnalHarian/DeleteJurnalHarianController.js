const BaseResponse = require("../../dto/BaseResponse")
const Joi = require("joi")

var uploadFile = require("../../dto/ManageFile")

var jurnalHarianService = require("../../services/JurnalHarian")
var siswaService = require("../../services/Siswa")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")

const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Konfigurasi Azure Blob Storage
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

if (!connectionString || !containerName) {
    console.error("Azure Storage connection string or container name is missing in .env file");
    process.exit(1);
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        id: Joi.string().required()
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { id } = value

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

    try {
        const url = cekJurnalHarian.data.foto
        const message = await uploadFile.deleteImageFromAzure(url);
    } catch (error) {
        result.success = false
        result.message = "Terjadi kesalahan saat delete foto"
        return res.status(500).json(result)
    }

    var deleteData = await jurnalHarianService.deleteData({
        id
    })

    if (deleteData.success) {
        result.message = "Jurnal harian berhasil dihapus..."
        // result.data = deleteData.data
        return res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
}

module.exports = handler