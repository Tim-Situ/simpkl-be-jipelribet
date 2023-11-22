var { aspekPenilaian } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await aspekPenilaian.create({
            data
        })
        return {success: true, data: newData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

module.exports = {
    createNew
}