var { nilaiBulanan } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await nilaiBulanan.create({
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
        var allData = await nilaiBulanan.findMany()
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await nilaiBulanan.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        return {success: false, data: error}
    }
}

async function updateData(id, data) {
    try {
        var dataUpdated = await nilaiBulanan.update({
            where: {
                id
            },
            data
        })
        return {success: true, data: dataUpdated}
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
}