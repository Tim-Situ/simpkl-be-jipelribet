var userService = require("../../services/Users")
var guruPembimbingService = require("../../services/GuruPembimbing")
var perusahaanService = require("../../services/Perusahaan")
var kelompokBimbinganService = require("../../services/KelompokBimbingan")
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

    const siswa = dataUser.data.dataSiswa
    var guru_pembimbing = {}
    var perusahaan = {}
    

    const kelompok_bimbingan = await kelompokBimbinganService.findOne({
        id_siswa: siswa[0].id
    })

    
    if(kelompok_bimbingan.success){
         guru_pembimbing = await guruPembimbingService.findOne({
            id: kelompok_bimbingan.id_guru_pembimbing
        })
    
        perusahaan = await perusahaanService.findOne({
            id: kelompok_bimbingan.id_perusahaan
        })
      
    }
    

   
     result.success = true
    result.message = "Data profile berhasil ditampilkan..."
    result.data = {
        id: dataUser.data.id, 
        username: dataUser.data.username,
        temp_password: dataUser.data.temp_password,
        role: dataUser.data.role,
        profile: siswa,
        guru_pembimbing: guru_pembimbing.data,
        perusahaan: perusahaan.data

        
    }

    return res.status(200).json(result)

    
}

module.exports = handler


