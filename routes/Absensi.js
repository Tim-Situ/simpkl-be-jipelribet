const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { PEMBIMBING } = require("../utils/constants")

var submitAbsensiController = require("../controllers/absensi/SubmitAbsensiController")

router.post("/submit", verifyToken, checkUserRole(PEMBIMBING), submitAbsensiController)

module.exports = router