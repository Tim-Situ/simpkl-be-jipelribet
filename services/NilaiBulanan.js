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

module.exports = {
    createNew,
    getAll,
}