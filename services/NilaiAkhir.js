var { nilaiAkhir } = require("../prisma/dbContext");

// async function createNew(data){
//     try {
//         var newData = await nilaiAkhir.create({
//             data
//         })
//         return {success: true, data: newData}
//     } catch (error) {
//         console.log(error)
//         return {success: false, data: []}
//     }
// }

async function getAll(where, orderBy, include) {
  try {
    var allData = await nilaiAkhir.findMany({
      where,
      orderBy,
      include,
    });
    return { success: true, data: allData };
  } catch (error) {
    console.log(error);
    return { success: false, data: [] };
  }
}

async function findOne(where) {
  try {
    var data = await nilaiAkhir.findFirstOrThrow({
      where,
    });

    return { success: true, data: data };
  } catch (error) {
    return { success: false, data: error };
  }
}

// async function updateData(id, data) {
//     try {
//         var dataUpdated = await nilaiAkhir.update({
//             where: {
//                 id
//             },
//             data
//         })
//         return {success: true, data: dataUpdated}
//     }
//     catch (error) {
//         console.log(error)
//         return {success: false, data: []}
//     }
// }

async function createBulk(data) {
  try {
    var arrData = [];

    for (let i = 0; i < data.nilaiAkhir.length; i++) {
      arrData.push({
        id_siswa: data.id_siswa,
        id_aspek_pembelajaran: data.nilaiAkhir[i].id_aspek_pembelajaran,
        nilai: data.nilaiAkhir[i].nilai,
        keterangan: data.nilaiAkhir[i].keterangan,
        createdBy: data.createdBy,
      });

      // Menggunakan 'findFirst' untuk mencari data berdasarkan 'id_siswa'
      const existingNilaiAkhir = await nilaiAkhir.findFirst({
        where: {
          id_siswa: data.id_siswa,
          id_aspek_pembelajaran: data.nilaiAkhir[i].id_aspek_pembelajaran,
        },
      });

      if (existingNilaiAkhir) {
        // Jika data sudah ada, lakukan update
        var updatedNilaiAkhir = await nilaiAkhir.update({
          where: {
            id: existingNilaiAkhir.id, // Menggunakan 'id' yang telah ditemukan
          },
          data: {
            nilai: data.nilaiAkhir[i].nilai,
            keterangan: data.nilaiAkhir[i].keterangan,
          },
        });
      } else {
        // Jika data belum ada, lakukan pembuatan data baru
        var newNilaiAkhir = await nilaiAkhir.create({
          data: arrData[i],
        });
      }
    }

    // var newAbsensi = await absensi.createMany({
    //     data: arrData,
    // })
    return { success: true, data: arrData };
  } catch (error) {
    console.log(error);
    return { success: false, data: null };
  }
}

module.exports = {
  // createNew,
  getAll,
  findOne,
  // updateData,
  createBulk,
};
