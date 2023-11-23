const multer = require('multer');
const router = require("express").Router()

var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

const upload = multer();

const { SISWA, PEMBIMBING } = require("../utils/constants")

var createJurnalHarianController = require("../controllers/jurnalHarian/CreateJurnalHarianController")
var createCatatanPembimbingController = require("../controllers/jurnalHarian/CreateCatatanPembimbingController")

router.post("/create", verifyToken, checkUserRole(SISWA), upload.single('foto'), createJurnalHarianController)
router.post("/catatan/pembimbing/create", verifyToken, checkUserRole(PEMBIMBING), createCatatanPembimbingController)

module.exports = router 