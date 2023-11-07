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

module.exports = {
    createUser,
    registerAdminSekolah
}