const { BlobServiceClient } = require("@azure/storage-blob");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Konstanta untuk pesan error
const ERROR_MISSING_ENV_VARS = "Azure Storage connection string or container name is missing in .env file";

// Kelas untuk menangani koneksi ke Azure Storage
class AzureStorageService {
    constructor() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

        if (!connectionString || !containerName) {
            console.error(ERROR_MISSING_ENV_VARS);
            process.exit(1);
        }

        this.containerClient = BlobServiceClient
            .fromConnectionString(connectionString)
            .getContainerClient(containerName);
    }

    getBlockBlobClient(blobName) {
        return this.containerClient.getBlockBlobClient(blobName);
    }
}

// Inisialisasi layanan Azure Storage
const azureStorage = new AzureStorageService();

// Fungsi untuk mendapatkan nama blob dari URL
function getBlobNameFromUrl(url) {
    const urlParts = new URL(url);
    const pathParts = urlParts.pathname.split("/");
    return pathParts.slice(2).join("/");
}

// Fungsi untuk mengecek apakah file ada di Azure
async function checkBlobExists(blockBlobClient) {
    return await blockBlobClient.exists();
}

// Kelas abstrak untuk strategi penyimpanan
class StorageStrategy {
    async upload(file) { throw new Error("Not Implemented"); }
    async delete(url) { throw new Error("Not Implemented"); }
}

// Implementasi strategi penyimpanan untuk Azure Storage
class AzureStorageStrategy extends StorageStrategy {
    constructor() {
        super();
        this.storageService = azureStorage;
    }

    async upload(file) {
        try {
            const blobName = `${Date.now()}-${path.basename(file.originalname)}`;
            const blockBlobClient = this.storageService.getBlockBlobClient(blobName);

            await blockBlobClient.uploadData(file.buffer, {
                blobHTTPHeaders: { blobContentType: file.mimetype },
            });

            return blockBlobClient.url;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async delete(url) {
        try {
            const blobName = getBlobNameFromUrl(url);
            const blockBlobClient = this.storageService.getBlockBlobClient(blobName);

            if (!await checkBlobExists(blockBlobClient)) {
                throw new Error("File tidak ditemukan di Azure Blob Storage.");
            }

            await blockBlobClient.delete();
            return "Foto Berhasil Dihapus...";
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

// Inisialisasi strategi penyimpanan
const storage = new AzureStorageStrategy();

module.exports = storage;
