const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { PEMBIMBING, SISWA } = require("../utils/constants")

var submitAbsensiController = require("../controllers/absensi/SubmitAbsensiController")
var getAbsensiSiswaController = require("../controllers/absensi/GetAbsensiSiswaController")

router.post("/submit", verifyToken, checkUserRole(PEMBIMBING), submitAbsensiController)
router.get("/get/siswa", verifyToken, checkUserRole(SISWA), getAbsensiSiswaController)

module.exports = router