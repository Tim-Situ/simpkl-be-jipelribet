const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { PEMBIMBING, SISWA } = require("../utils/constants")

var submitAbsensiController = require("../controllers/absensi/SubmitAbsensiController")
var getAbsensiSiswaController = require("../controllers/absensi/GetAbsensiSiswaController")
var getAbsensiPembimbingController = require("../controllers/absensi/GetAbsensiPembimbingController")

router.post("/submit", verifyToken, checkUserRole(PEMBIMBING), submitAbsensiController)
router.get("/get/siswa", verifyToken, checkUserRole(SISWA), getAbsensiSiswaController)
router.get("/get/pembimbing", verifyToken, checkUserRole(PEMBIMBING), getAbsensiPembimbingController)

module.exports = router