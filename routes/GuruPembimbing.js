const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var getAllGuruPembimbingController = require("../controllers/guruPembimbing/GetAllGuruPembimbingController")
var createGuruPembimbingController = require("../controllers/guruPembimbing/CreateGuruPembimbingController")
var updateGuruPembimbingController = require("../controllers/guruPembimbing/UpdateGuruPembimbingController")
var updateStatusGuruPembimbingController = require("../controllers/guruPembimbing/UpdateStatusGuruPembimbingController")

router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllGuruPembimbingController)
router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createGuruPembimbingController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateGuruPembimbingController)
router.put("/status", verifyToken, checkUserRole(ADMINSEKOLAH), updateStatusGuruPembimbingController)

module.exports = router 