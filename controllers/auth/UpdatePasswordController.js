var Joi = require("joi")
var bcrypt = require("bcrypt")
const BaseResponse = require("../../dto/BaseResponse")
const cekPassword = require("../../dto/CekPasswordValid")
var userService = require("../../services/Users")

async function handler(req, res) {
    var result = new BaseResponse()

    var schema = Joi.object({
        old_password : Joi.string().required(),
        new_password : Joi.string().min(8).required(),
    })

    var { error, value } = schema.validate(req.body)

    if (error) {
        result.success = false
        result.message = error.message
        result.data = error.stack
        return res.status(400).json(result)
    }

    var { old_password, new_password } = value

    const cekPasswordValid = cekPassword.cekPasswordValid(new_password)

    if (!cekPasswordValid.success) {
        result.success = false
        result.message = "Password harus terdiri minimal 1 huruf kecil, 1 huruf besar, 1 angka dan 1 karakter spesial"
        return res.status(400).json(result) 
    }

    var dataUser = await userService.findUser({
        username : req.username
    })

    if(!dataUser.success){
        result.success = false
        result.message = "Terjadi kesalahan dalam sistem..."
        return res.status(500).json(result)
    }

    const match = await bcrypt.compare(old_password, dataUser.data.password)
    if(!match){
        result.success = false
        result.message = "Password lama tidak sesuai..."
        return res.status(400).json(result)
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(new_password, salt)

    var updatePassword = await userService.updateUser(
        {username : req.username},
        {
            password: hashPassword,
            temp_password: null,
            updatedBy: req.username
        }
    )

    if (updatePassword.success) {
        result.message = "Password berhasil diubah..."
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler