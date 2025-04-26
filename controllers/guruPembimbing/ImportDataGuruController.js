var Joi = require("joi")
var bcrypt = require("bcrypt")
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');


const BaseResponse = require("../../dto/BaseResponse")
var randomPassword = require("../../middleware/GenerateRandomPassword")

var userService = require("../../services/Users")
var guruService = require("../../services/GuruPembimbing")

function normalizeRow(row) {
    return {
        nip: String(row.nip || "").trim(),
        nama: String(row.nama || "").trim(),
        alamat: String(row.alamat || "").trim(),
        no_hp: String(row.no_hp || "").trim()
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
            nip : Joi.string().max(50).required(),
            nama : Joi.string().max(100).required(),
            alamat : Joi.string().required(),
            no_hp : Joi.string().required()
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

            const { nip, nama, alamat, no_hp } = value;

            const existingUser = await userService.findUser({ username: nip });
            if (existingUser.success) {
                failed.push({ row, error: "NIP sudah digunakan" });
                continue;
            }


            const passGen = randomPassword.generateRandomPassword(8);
            if (!passGen.success) {
                failed.push({ row, error: "Gagal generate password" });
                continue;
            }

            const hash = await bcrypt.hash(passGen.data, await bcrypt.genSalt());

            const newUser = await userService.createUser({
                username: nip,
                password: hash,
                temp_password: passGen.data,
                role: "PEMBIMBING",
                createdBy: req.username
            });

            if (!newUser.success) {
                failed.push({ row, error: "Gagal membuat user" });
                continue;
            }

            const newGuru = await guruService.createNew({
            
                nip,
                nama,
                alamat,
                no_hp,
                createdBy: req.username
            });

            if (newGuru.success) {
                imported.push({ nip, nama });
            } else {
                failed.push({ row, error: "Gagal menyimpan data guru" });
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