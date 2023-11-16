const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tujuanPembelajaranData = [
    { judul: 'asdsad sad s', deskripsi: 'asdsad asd a', createdBy: 'asdjasmjd sa', updatedBy: 'lashdsaskdaj as' },
];

async function seed() {
    for (const data of tujuanPembelajaranData) {
      await prisma.tujuanPembelajaran.create({
        data: data,
      });
    }
}

seed()
  .catch((error) => {
    throw error;
})
  .finally(async () => {
    await prisma.$disconnect();
});