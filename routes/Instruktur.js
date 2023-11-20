const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { PERUSAHAAN, ADMINSEKOLAH } = require("../utils/constants")

var createInstrukturController = require("../controllers/instruktur/CreateInstrukturController")
var getAllInstrukturController = require("../controllers/instruktur/GetAllInstrukturController")
var updateInstrukturController = require("../controllers/instruktur/UpdateInstrukturController")

router.post("/create", verifyToken, checkUserRole([PERUSAHAAN, ADMINSEKOLAH]), createInstrukturController)
router.get("/all", verifyToken, checkUserRole([PERUSAHAAN, ADMINSEKOLAH]), getAllInstrukturController)
router.put("/update", verifyToken, checkUserRole([PERUSAHAAN, ADMINSEKOLAH]), updateInstrukturController)

module.exports = router 