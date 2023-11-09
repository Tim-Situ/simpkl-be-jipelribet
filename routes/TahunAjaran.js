const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createTahunAjaranController = require("../controllers/tahunAjaran/CreateTahunAjaranController")
var getAllTahunAjaranController = require("../controllers/tahunAjaran/GetAllTahunAjaranController")
var updateStatusTahunAjaranController = require("../controllers/tahunAjaran/UpdateStatusTahunAjaranController")

router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createTahunAjaranController)
router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllTahunAjaranController)
router.put("/status", verifyToken, checkUserRole(ADMINSEKOLAH), updateStatusTahunAjaranController)

module.exports = router