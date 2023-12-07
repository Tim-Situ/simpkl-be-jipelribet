var { tahunAjaran, tahunAjaran } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await tahunAjaran.create({
            data
        })

        return {success: true, data: newData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function getAll(orderBy){
    try {
        var allData = await tahunAjaran.findMany({
            orderBy
        })
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await tahunAjaran.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        // console.log(error)
        return {success: false, data: null}
    }
    
}

async function updateStatus(id, data){
    try {
        var updateStatus = await tahunAjaran.update({
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
    updateStatus
}