var { guruPembimbing } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await guruPembimbing.create({
            data
        })

        return {success: true, data: newData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function getAll(){
    try {
        var allData = await guruPembimbing.findMany({
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

async function findOne(where){
    try {
        var data = await guruPembimbing.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        // console.log(error)
        return {success: false, data: []}
    }
    
}

async function updateData(where, data){
    try {
        var dataUpdated = await guruPembimbing.update({
            where,
            data
        })

        return {success: true, data: dataUpdated}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function updateStatus(id, data){
    try {
        var updateStatus = await guruPembimbing.update({
            where : {
                id
            },
            data
        })

        return {success: true, data: updateStatus}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

module.exports = {
    createNew,
    getAll,
    findOne,
    updateData,
    updateStatus
}