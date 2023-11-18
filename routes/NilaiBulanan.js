const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { PEMBIMBING } = require("../utils/constants")

// var getAllNilaiBulananController = require("../controllers/nilaiBulanan/GetAllNilaiBulananController")
var createNilaiBulananController = require("../controllers/nilaiBulanan/CreateNilaiBulananController")

// router.get("/all", verifyToken, checkUserRole(PEMBIMBING), getAllNilaiBulananController)
router.post("/create", verifyToken, checkUserRole(PEMBIMBING), createNilaiBulananController)

module.exports = router