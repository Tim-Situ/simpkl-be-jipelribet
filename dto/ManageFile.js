const AWS = require('aws-sdk');
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

async function deleteImageFromAzure(url) {
    try {
        const urlParts = new URL(url);
        const pathParts = urlParts.pathname.split("/");
        const blobName = pathParts.slice(2).join("/"); // Nama file (blob)
        console.log(blobName)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Periksa apakah file ada
        const exists = await blockBlobClient.exists();
        if (!exists) {
            throw new Error("File tidak ditemukan di Azure Blob Storage.");
        }

        // Hapus file
        await blockBlobClient.delete();
        return "Foto Berhasil Dihapus...";
    } catch (error) {
        throw new Error(error.message);
    }
}

// Fungsi untuk mengunggah gambar ke Azure Blob Storage
async function uploadImageToAzure(file) {
    try {
        const fileBuffer = file.buffer;
        const originalName = file.originalname;
        const blobName = `${Math.floor(Date.now() / 1000)}-${path.basename(originalName)}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload file ke Azure Blob menggunakan buffer
        await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype }, // Menentukan content type
        });

        return blockBlobClient.url;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    deleteImageFromAzure,
    uploadImageToAzure
};
