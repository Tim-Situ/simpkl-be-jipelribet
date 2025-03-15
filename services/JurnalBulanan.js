var { jurnalBulanan } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await jurnalBulanan.create({
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
        var data = await jurnalBulanan.findMany({
            where,
            include
        })

        return {success: true, data}
    } catch (error) {
        console.log(error)
        return {success: false, data: null}
    }
}

async function findOne(where){
    try {
        var data = await jurnalBulanan.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        return {success: false, data: []}
    }
    
}

async function updateData(id, data){
    try {
        var dataUpdated = await jurnalBulanan.update({
            where: {
                id
            },
            data
        })

        return {success: true, data: dataUpdated}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function deleteData(where) {
    try {
        var dataDeleted = await jurnalBulanan.delete({
            where
        })

        return {success: true, data: dataDeleted}
    }
    catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

module.exports = {
    createNew,
    getAll,
    findOne,
    updateData,
    deleteData
}