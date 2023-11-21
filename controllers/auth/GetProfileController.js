var userService = require("../../services/Users")
const BaseResponse = require("../../dto/BaseResponse")
const { ADMINSEKOLAH, INSTRUKTUR, PEMBIMBING, PERUSAHAAN, SISWA } = require("../../utils/constants")

async function handler(req, res) {
    var result = new BaseResponse()

    var where = {
        username : req.username
    }

    var select

    var dataUser = await userService.findUser({
        username: req.username
    })

    if(!dataUser.success){
        result.success = false
        result.message = "Data user tidak ditemukan..."
        return res.status(404).json(result)
    }

    if(req.role == ADMINSEKOLAH){
        select = {
            username: true,
            role: true,
            dataAdminSekolah: {
                select: {
                    nama: true,
                    alamat: true,
                    no_hp: true,

                }
            }
        }

    }else if(req.role == PEMBIMBING){
        select = {
            username: true,
            role: true,
            dataGuruPembimbing: {
                select: {
                    nip: true,
                    nama: true,
                    alamat: true,
                    no_hp: true,
                    status_aktif: true
                }
            }
        }
    
    }else if(req.role == SISWA){
        select = {
            username: true,
            role: true,
            dataSiswa: {
                select: {
                    nis: true,
                    nisn: true,
                    nama: true,
                    alamat: true,
                    no_hp: true,
                    tempat_lahir: true,
                    tanggal_lahir: true,
                    status_aktif: true,
                    jurusan: {
                        select: {
                            bidang_keahlian: true,
                            program_keahlian: true,
                            kompetensi_keahlian: true,
                        }
                    }
                }
            }
        }
    
    }else if(req.role == PERUSAHAAN){
        select = {
            username: true,
            role: true,
            dataPerusahaan: {
                select: {
                    nama_perusahaan: true,
                    pimpinan: true,
                    alamat: true,
                    no_hp: true,
                    email: true,
                    website: true
                }
            }
        }
    
    }else if(req.role == INSTRUKTUR){
        select = {
            username: true,
            role: true,
            dataInstruktur: {
                select: {
                    nama: true,
                    no_hp: true,
                    status_aktif: true,
                    perusahaan: {
                        select: {
                            nama_perusahaan: true
                        }
                    }
                }
            }
        }
    }

    var profileUser = await userService.getProfile(where, select)
    var data = {}

    if (profileUser.success) {
        data.username = profileUser.data.username
        data.role = profileUser.data.role
        
        if (profileUser.data.role == ADMINSEKOLAH) {
            data.dataPengguna = profileUser.data.dataAdminSekolah
        } else if (profileUser.data.role == PEMBIMBING) {
            data.dataPengguna = profileUser.data.dataGuruPembimbing
        } else if (profileUser.data.role == SISWA) {
            data.dataPengguna = profileUser.data.dataSiswa
        } else if (profileUser.data.role == INSTRUKTUR) {
            data.dataPengguna = profileUser.data.dataInstruktur
        } else if (profileUser.data.role == PERUSAHAAN) {
            data.dataPengguna = profileUser.data.dataPerusahaan
        }

        result.message = "Data profile berhasil ditampilkan..."
        result.data = data
        res.status(200).json(result)
    } else {
        result.success = false
        result.message = "Internal Server Error"
        res.status(500).json(result)
    }
}

module.exports = handler


