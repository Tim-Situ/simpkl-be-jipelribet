const { PrismaClient } = require("@prisma/client")

let prisma 

prisma = new PrismaClient()

module.exports = new PrismaClient()