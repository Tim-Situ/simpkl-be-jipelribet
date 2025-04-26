const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

var getAllGuruPembimbingController = require("../controllers/guruPembimbing/GetAllGuruPembimbingController")
var createGuruPembimbingController = require("../controllers/guruPembimbing/CreateGuruPembimbingController")
var updateGuruPembimbingController = require("../controllers/guruPembimbing/UpdateGuruPembimbingController")
var updateStatusGuruPembimbingController = require("../controllers/guruPembimbing/UpdateStatusGuruPembimbingController")
var deleteGuruPembimbingController = require("../controllers/guruPembimbing/DeleteGuruPembimbingController")
var importDataGuruController = require("../controllers/guruPembimbing/ImportDataGuruController")

router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllGuruPembimbingController)
router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createGuruPembimbingController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateGuruPembimbingController)
router.put("/status", verifyToken, checkUserRole(ADMINSEKOLAH), updateStatusGuruPembimbingController)
router.delete("/delete", verifyToken, checkUserRole(ADMINSEKOLAH), deleteGuruPembimbingController)
router.post("/import-excel", verifyToken, checkUserRole(ADMINSEKOLAH), upload.single('file'), importDataGuruController)
module.exports = router 