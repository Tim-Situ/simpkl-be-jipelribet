const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var createTahunAjaranController = require("../controllers/tahunAjaran/CreateTahunAjaranController")
var getAllTahunAjaranController = require("../controllers/tahunAjaran/GetAllTahunAjaranController")
var updateStatusTahunAjaranController = require("../controllers/tahunAjaran/UpdateStatusTahunAjaranController")

router.post("/create", createTahunAjaranController)
router.get("/all", getAllTahunAjaranController)
router.put("/status", updateStatusTahunAjaranController)

module.exports = router