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

        for (let i = 0; i < data.nilaiBulanan.length; i++) {
            arrData.push({
                id_bimbingan : data.id_bimbingan,
                bulan: data.bulan,
                tahun: data.tahun,
                id_tujuan_pembelajaran : data.nilaiBulanan[i].id_tujuan_pembelajaran,
                nilai : data.nilaiBulanan[i].nilai,
                deskripsi : data.nilaiBulanan[i].deskripsi,
                createdBy: data.createdBy
            })

            // Menggunakan 'findFirst' untuk mencari data berdasarkan 'id_bimbingan' dan 'tanggal'
            const existingNilaiBulanan = await nilaiBulanan.findFirst({
                where: {
                    id_bimbingan: data.id_bimbingan,
                    id_tujuan_pembelajaran: data.nilaiBulanan[i].id_tujuan_pembelajaran,
                    bulan: data.bulan,
                    tahun: data.tahun,
                }
            });

            if (existingNilaiBulanan) {
                // Jika data sudah ada, lakukan update
                var updatedNilaiBulanan = await nilaiBulanan.update({
                    where: {
                        id: existingNilaiBulanan.id // Menggunakan 'id' yang telah ditemukan
                    },
                    data: {
                        nilai : data.nilaiBulanan[i].nilai,
                        deskripsi : data.nilaiBulanan[i].deskripsi,
                    }
                });
            } else {
                // Jika data belum ada, lakukan pembuatan data baru
                var newNilaiBulanan = await nilaiBulanan.create({
                    data: arrData[i]
                });
            }
        }

        // var newAbsensi = await absensi.createMany({
        //     data: arrData,
        // })
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