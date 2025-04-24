var Joi = require("joi")
var bcrypt = require("bcrypt")
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');


const BaseResponse = require("../../dto/BaseResponse")
var randomPassword = require("../../middleware/GenerateRandomPassword")

var userService = require("../../services/Users")
var siswaService = require("../../services/Siswa")
var jurusanService = require("../../services/Jurusan")

function normalizeRow(row) {
    return {
        nis: String(row.nis || "").trim(),
        nisn: String(row.nisn || "").trim(),
        nama: String(row.nama || "").trim(),
        alamat: String(row.alamat || "").trim(),
        no_hp: String(row.no_hp || "").trim(),
        tempat_lahir: String(row.tempat_lahir || "").trim(),
        tanggal_lahir: new Date(row.tanggal_lahir),
        jurusan: String(row.jurusan || "").trim()
    };
}

async function handler(req, res) {
    var result = new BaseResponse()

    if (!req.file) {
        result.success = false;
        result.message = "File tidak ditemukan";
        return res.status(400).json(result);
    }

    const filePath = req.file.path;

    try {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        const schema = Joi.object({
            nis: Joi.string().max(50).required(),
            nisn: Joi.string().max(50).required(),
            nama: Joi.string().max(100).required(),
            alamat: Joi.string().required(),
            no_hp: Joi.string().max(20).required(),
            tempat_lahir: Joi.string().max(100).required(),
            tanggal_lahir: Joi.date().required(),
            jurusan: Joi.string().required(),
        });

        const imported = [];
        const failed = [];

        for (const row of data) {
            const normalizedRow = normalizeRow(row);
            const { error, value } = schema.validate(normalizedRow);

            if (error) {
                failed.push({ row, error: error.message });
                continue;
            }

            const { nis, nisn, nama, alamat, no_hp, tempat_lahir, tanggal_lahir, jurusan } = value;

            const existingUser = await userService.findUser({ username: nisn });
            if (existingUser.success) {
                failed.push({ row, error: "NISN sudah digunakan" });
                continue;
            }

            const dataJurusan = await jurusanService.findOne({ 
                kompetensi_keahlian: {
                    equals: jurusan,
                    mode: 'insensitive'
                }
            });

            if (!dataJurusan.success) {
                failed.push({ row, error: "Jurusan tidak ditemukan" });
                continue;
            }

            const passGen = randomPassword.generateRandomPassword(8);
            if (!passGen.success) {
                failed.push({ row, error: "Gagal generate password" });
                continue;
            }

            const hash = await bcrypt.hash(passGen.data, await bcrypt.genSalt());

            const newUser = await userService.createUser({
                username: nisn,
                password: hash,
                temp_password: passGen.data,
                role: "SISWA",
                createdBy: req.username
            });

            if (!newUser.success) {
                failed.push({ row, error: "Gagal membuat user" });
                continue;
            }

            const newSiswa = await siswaService.createNew({
                id_jurusan: dataJurusan.data.id,
                nis,
                nisn,
                nama,
                alamat,
                no_hp,
                tempat_lahir,
                tanggal_lahir,
                foto: "https://gambarpkl.blob.core.windows.net/gambar-simpkl/1735314679-user-profile.png",
                createdBy: req.username
            });

            if (newSiswa.success) {
                imported.push({ nisn, nama });
            } else {
                failed.push({ row, error: "Gagal menyimpan data siswa" });
            }
        }

        fs.unlinkSync(filePath);

        result.success = true;
        result.message = "Proses import selesai";
        result.data = { imported, failed };
        return res.json(result);

    } catch (err) {
        console.error(err);
        fs.unlinkSync(filePath);
        result.success = false;
        result.message = "Terjadi kesalahan saat memproses file";
        return res.status(500).json(result);
    }
}

module.exports = handler