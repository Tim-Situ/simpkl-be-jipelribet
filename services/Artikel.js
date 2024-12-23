var { artikel } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await artikel.create({
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
        var allData = await artikel.findMany()
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await artikel.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
    
}

async function updateData(id, data){
    try {
        var dataUpdated = await artikel.update({
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
        var dataDeleted = await artikel.delete({
            where
        })

        return {success: true, data: dataDeleted}
    }
    catch (error) {
        // console.log(error)
        return {success: false, data: null}
    }
}

module.exports = {
    createNew,
    getAll,
    findOne,
    updateData,
    deleteData
}