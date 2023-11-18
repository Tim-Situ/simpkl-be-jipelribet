var Joi = require("joi")
var bcrypt = require("bcrypt")
const randomatic = require('randomatic');

var {INSTRUKTUR, PERUSAHAAN} = require("../../utils/constants")
var randomPassword = require("../../middleware/GenerateRandomPassword")
var userService = require("../../services/Users")
var instrukturService = require("../../services/Instruktur")
var perusahaanService = require("../../services/Perusahaan")

const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        username : Joi.string().max(100).required(),
        nama : Joi.string().max(100).required(),
        no_hp : Joi.string().max(25).required(),
        id_perusahaan: Joi.string().allow(null, '') // Jika yg input adalah ADMINSEKOLAH
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { username, nama, no_hp, id_perusahaan } = value
    var role = INSTRUKTUR
    var where

    // const password = randomatic('Aa0!', 8);
    const password = randomPassword.generateRandomPassword(8)

    if (!password.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }
    
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password.data, salt)

    var cekUsername = await userService.findUser({
        username
    })

    if(cekUsername.success){
        result.success = false
        result.message = "Username sudah digunakan..."
        return res.status(400).json(result)
    }

    if(req.role == PERUSAHAAN){
        where = {
            username: req.username
        }
    }else{
        if (!id_perusahaan) {
            result.success = false
            result.message = "id_perusahaan tidak boleh kosong..."
            return res.status(400).json(result)
        }
        
        where = {
            id: id_perusahaan
        }
    }

    var perusahaan = await perusahaanService.findOne(where)

    if(!perusahaan.success){
        result.success = false
        result.message = "Data perusahaan tidak ditemukan..."
        return res.status(400).json(result)
    }

    var newUser = await userService.createUser({
        username,
        password : hashPassword,
        temp_password : password.data,
        role,
        createdBy : req.username
    })

    if (!newUser.success) {
        result.success = false
        result.message = "Internal Server Error"
        return res.status(500).json(result)
    }

    var newInstruktur = await instrukturService.createNew({
        id_perusahaan: perusahaan.data.id,
        username,
        nama,
        no_hp,
        createdBy : req.username
    })

    if (newInstruktur.success) {
        result.message = "Data instruktur berhasil ditambahkan..."
        result.data = newInstruktur.data
        res.status(201).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler