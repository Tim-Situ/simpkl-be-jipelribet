const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { PEMBIMBING } = require("../utils/constants")

var updateNilaiBulananController = require("../controllers/nilaiBulanan/UpdateNilaiBulananController")
var createNilaiBulananController = require("../controllers/nilaiBulanan/CreateNilaiBulananController")

router.post("/create", verifyToken, checkUserRole(PEMBIMBING), createNilaiBulananController)
router.put("/update", verifyToken, checkUserRole(PEMBIMBING), updateNilaiBulananController)

module.exports = router