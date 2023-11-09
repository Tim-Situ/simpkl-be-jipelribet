var { adminSekolah, user } = require("../prisma/dbContext")

async function createUser(data){
    try {
        var newUser = await user.create({
            data
        })

        return {success: true}
    } catch (error) {
        console.log(error)
        return {success: false}
    }
}

async function registerAdminSekolah(data) {
    try {
        var newAdminSekolah = await adminSekolah.create({
            data
        })

        return {success: true, data: newAdminSekolah}
    } catch (error) {
        console.log(error)
        return {success: false}
    }
}

async function findUser(where){
    try {
        var dataUser = await user.findFirst({
            where
        })

        if (dataUser != null) {
            return {success: true, data: dataUser}
        }else{
            return {success: false, data: []}
        }
        
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function updateRefreshToken(id, token){
    try {
        var updated = await user.update({
            where : {
                id
            },
            data : {
                refresh_token : token
            }
        })

        return {success: true, data: updated}
    } catch (error) {
        console.log(error)
        return {success: false}
    }
}

module.exports = {
    createUser,
    registerAdminSekolah,
    findUser,
    updateRefreshToken
}