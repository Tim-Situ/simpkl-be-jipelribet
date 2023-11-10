var { perusahaan } = require("../prisma/dbContext")

async function registrasi(data) {
    try {
        var newPerusahaan = await perusahaan.create({
            data
        })

        return {success: true, data: newPerusahaan}
    } catch (error) {
        console.log(error)
        return {success: false}
    }
}

async function getAll(){
    try {
        var allData = await perusahaan.findMany({
            include: {
                user : {
                    select: {
                        username : true,
                        temp_password : true
                    }
                }
            }
        })
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function updateData(where, data){
    try {
        var dataUpdated = await perusahaan.updateMany({
            where,
            data
        })

        return {success: true, data: dataUpdated}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await perusahaan.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        // console.log(error)
        return {success: false, data: []}
    }
    
}

module.exports = {
    registrasi,
    getAll,
    updateData,
    findOne
}