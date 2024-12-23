const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createPengumumanController = require("../controllers/pengumuman/CreatePengumumanController")
var getAllPengumumanController = require("../controllers/pengumuman/GetAllPengumumanController")
var updatePengumumanController = require("../controllers/pengumuman/UpdatePengumumanController")
var deletePengumumanController = require("../controllers/pengumuman/DeletePengumumanController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createPengumumanController)
router.get("/all", getAllPengumumanController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updatePengumumanController)
router.delete("/delete", verifyToken, checkUserRole(ADMINSEKOLAH), deletePengumumanController)

module.exports = router