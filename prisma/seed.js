const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var bcrypt = require("bcrypt");

async function seed() {
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash('pass@123', salt)

  var newUserData = await prisma.user.create({
    data : {
      username: 'ini_pembimbing',
      password: hashPassword,
      role: 'PEMBIMBING',
    }
  })
}


seed()
  .catch((error) => {
    throw error;
})
  .finally(async () => {
    await prisma.$disconnect();
});