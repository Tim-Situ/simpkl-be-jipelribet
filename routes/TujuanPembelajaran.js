const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createTujuanPembelajaranController = require("../controllers/tujuanPembelajaran/CreateTujuanPembelajaranController")
var getTujuanPembelajaranController = require("../controllers/tujuanPembelajaran/GetAllTujuanPembelajaranController")
var updateTujuanPembelajaranController = require("../controllers/tujuanPembelajaran/UpdateTujuanPembelajaranController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createTujuanPembelajaranController)
router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getTujuanPembelajaranController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateTujuanPembelajaranController)

module.exports = router