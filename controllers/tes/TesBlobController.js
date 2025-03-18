const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const dotenv = require("dotenv");
const BaseResponse = require("../../dto/BaseResponse");

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

// Fungsi untuk mengecek apakah container tersedia
async function checkAndCreateContainer() {
    try {
        console.log(`Checking if container "${containerName}" exists...`);
        const exists = await containerClient.exists();

        if (!exists) {
            console.log(`Container "${containerName}" does not exist. Creating it...`);
            await containerClient.create();
            console.log(`Container "${containerName}" has been created.`);
        } else {
            console.log(`Container "${containerName}" already exists.`);
        }
    } catch (error) {
        console.error("Error checking/creating container:", error.message);
    }
}

async function handler(req, res) {
    const result = new BaseResponse();

    try {
        await checkAndCreateContainer(); // Pastikan container tersedia sebelum upload

        if (!req.file) {
            result.success = false;
            result.message = "File gambar tidak ditemukan...";
            return res.status(400).json(result);
        }

        // Ambil buffer file
        const fileBuffer = req.file.buffer;
        const originalName = req.file.originalname;
        const blobName = `${Math.floor(Date.now() / 1000)}-${path.basename(originalName)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log(`Uploading file "${originalName}" to Azure Blob as "${blobName}"`);

        // Upload file ke Azure Blob menggunakan buffer
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype }, // Menentukan content type
        });

        result.success = true;
        result.message = "Berhasil Upload";
        result.data = blockBlobClient.url; // URL file di Azure Blob
        return res.json(result);
    } catch (error) {
        console.error("Error uploading file:", error.message);

        result.success = false;
        result.message = "Gagal Upload";
        result.data = error.message;
        return res.status(500).json(result);
    }
}

module.exports = handler;
