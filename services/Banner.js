var { banner } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await banner.create({
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
        var allData = await banner.findMany()
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await banner.findFirstOrThrow({
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
        var dataUpdated = await banner.update({
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
        var dataDeleted = await banner.delete({
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