const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createAspekPenilaianController = require("../controllers/AspekPenilaian/CreateAspekPenilaianController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createAspekPenilaianController)

module.exports = router