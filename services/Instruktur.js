var { instruktur } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await instruktur.create({
            data
        })

        return {success: true, data: newData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function getAll(where, include){
    try {
        var allData = await instruktur.findMany({
            where,
            include
        })

        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await instruktur.findFirstOrThrow({
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
        var dataUpdated = await instruktur.update({
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
        var updateStatus = await instruktur.update({
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