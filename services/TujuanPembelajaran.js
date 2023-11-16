var { tujuanPembelajaran } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await tujuanPembelajaran.create({
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
        var allData = await tujuanPembelajaran.findMany()
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await tujuanPembelajaran.findFirstOrThrow({
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
        var dataUpdated = await tujuanPembelajaran.update({
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

module.exports = {
    createNew,
    getAll,
    findOne,
    updateData,
}