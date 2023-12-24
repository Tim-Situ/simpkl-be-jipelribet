var { absensi } = require("../prisma/dbContext")

async function createBulk(data) {
    try {
        var arrData = []

        for (let i = 0; i < data.absensi.length; i++) {
            arrData.push({
                tanggal : data.tanggal,
                id_bimbingan : data.absensi[i].id_bimbingan,
                status : data.absensi[i].status,
            })

            // Menggunakan 'findFirst' untuk mencari data berdasarkan 'id_bimbingan' dan 'tanggal'
            const existingAbsen = await absensi.findFirst({
                where: {
                    id_bimbingan: data.absensi[i].id_bimbingan,
                    tanggal: data.tanggal,
                }
            });

            if (existingAbsen) {
                // Jika data sudah ada, lakukan update
                var updatedAbsen = await absensi.update({
                    where: {
                        id: existingAbsen.id // Menggunakan 'id' yang telah ditemukan
                    },
                    data: {
                        status: data.absensi[i].status
                    }
                });
            } else {
                // Jika data belum ada, lakukan pembuatan data baru
                var newAbsen = await absensi.create({
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

async function search(where, include, orderBy) {
    try {
        var data = await absensi.findMany({
            where,
            include,
            orderBy
        })
        return { success: true, data: data }
    }
    catch (error) {
        console.log(error)
        return { success: false, data: [] }
    }
}

async function findOne(where){
    try {
        var data = await absensi.findFirstOrThrow({
            where
        })

        return {success: true, data: data}
    } catch (error) {
        // console.log(error)
        return {success: false, data: null}
    }
    
}

module.exports = {
    createBulk,
    search,
    findOne
}