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
        }

        var newAbsensi = await absensi.createMany({
            data: arrData,
        })
        return {success: true, data: arrData}
    } catch (error) {
        console.log(error);
        return {success: false, data: null}
    }
}

module.exports = {
    createBulk
}