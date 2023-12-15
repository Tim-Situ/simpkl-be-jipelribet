var { siswa } = require("../prisma/dbContext")

async function createNew(data){
    try {
        var newData = await siswa.create({
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
        var allData = await siswa.findMany({
            include: {
                jurusan : {
                    select : {
                        id: true,
                        bidang_keahlian: true,
                        program_keahlian: true,
                        kompetensi_keahlian: true
                    }
                },
                user : {
                    select: {
                        username : true,
                        temp_password : true
                    }
                }
            }
        })
        return {success: true, data: allData}
    } catch (error) {
        console.log(error)
        return {success: false, data: []}
    }
}

async function findOne(where){
    try {
        var data = await siswa.findFirstOrThrow({
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
        var dataUpdated = await siswa.update({
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
        var updateStatus = await siswa.update({
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

async function deleteData(where) {
    try {
        var dataDeleted = await siswa.delete({
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
    updateStatus,
    deleteData
}