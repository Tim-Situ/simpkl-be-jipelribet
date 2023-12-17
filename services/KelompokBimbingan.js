var { kelompokBimbingan } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await kelompokBimbingan.create({
            data
        })

        return {success: true, data: newData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

// async function getAll(where, include, orderBy){
//     try {
//         var allData = await kelompokBimbingan.findMany({
//             where,
//             include,
//             orderBy
//     })
//         return {success: true, data: allData}
//     } catch (error) {
//         console.log(error)
//         return {success: false, data: []}
//     }
// }

async function getAll(where, select, orderBy){
    try {
        var allData = await kelompokBimbingan.findMany({
            where,
            select,
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
        var data = await kelompokBimbingan.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        // console.log(error)
        return {success: false, data: []}
    }
    
}

async function search(where){
    try {
        var data = await kelompokBimbingan.findMany({
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
        var dataUpdated = await kelompokBimbingan.update({
            where,
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
        var dataDeleted = await kelompokBimbingan.delete({
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
    search,
    deleteData
}