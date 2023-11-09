const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createJurusanController = require("../controllers/jurusan/CreateJurusanController")
var getAllJurusanController = require("../controllers/jurusan/GetAllJurusanController")
var updateJurusanController = require("../controllers/jurusan/UpdateJurusanController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createJurusanController)
router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllJurusanController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateJurusanController)

module.exports = router