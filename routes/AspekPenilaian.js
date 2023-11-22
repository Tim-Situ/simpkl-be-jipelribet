const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createAspekPenilaianController = require("../controllers/AspekPenilaian/CreateAspekPenilaianController")
var updateAspekPenilaianController = require("../controllers/AspekPenilaian/UpdateAspekPeniliaianController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createAspekPenilaianController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateAspekPenilaianController)

module.exports = router