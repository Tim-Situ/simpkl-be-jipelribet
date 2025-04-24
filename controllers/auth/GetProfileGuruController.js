var userService = require("../../services/Users")
const BaseResponse = require("../../dto/BaseResponse")

async function handler(req, res) {
    var result = new BaseResponse()

   
    var dataUser = await userService.findUser({
        username: req.username
    })

    if(!dataUser.success){
        result.success = false
        result.message = "Data user tidak ditemukan..."
        return res.status(404).json(result)
    }

    result.success = true
    result.message = "Data profile berhasil ditampilkan..."
    result.data = {
        id: dataUser.data.id, 
        username: dataUser.data.username,
        temp_password: dataUser.data.temp_password,
        role: dataUser.data.role,
        profile: dataUser.data.dataGuruPembimbing
        
    }

    return res.status(200).json(result)

    
}

module.exports = handler


