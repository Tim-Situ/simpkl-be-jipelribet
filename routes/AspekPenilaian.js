const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createAspekPenilaianController = require("../controllers/AspekPenilaian/CreateAspekPenilaianController")
var updateAspekPenilaianController = require("../controllers/AspekPenilaian/UpdateAspekPeniliaianController")
var getAspekPenilaianController = require("../controllers/AspekPenilaian/GetAllAspekPenilaianController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createAspekPenilaianController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateAspekPenilaianController)
router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAspekPenilaianController)

module.exports = router