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

async function getAll(where, orderBy, include){
    try {
        var allData = await nilaiBulanan.findMany({
            where,
            orderBy,
            include
        })
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

async function createBulk(data) {
    try {
        var arrData = []

        for (let i = 0; i < data.nilai.length; i++) {
            arrData.push({
                id_bimbingan : data.id_bimbingan,
                bulan : data.bulan,
                tahun : data.tahun,
                id_tujuan_pembelajaran : data.nilai[i].id_tujuan_pembelajaran,
                nilai : data.nilai[i].nilai,
                deskripsi : data.nilai[i].deskripsi,
            })
        }

        var newNilai = await nilaiBulanan.createMany({
            data: arrData,
        })
        return {success: true, data: arrData}
    } catch (error) {
        console.log(error);
        return {success: false, data: null}
    }
}

module.exports = {
    createNew,
    getAll,
    findOne,
    updateData,
    createBulk
}