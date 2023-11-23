const multer = require('multer');
const router = require("express").Router()

var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

const upload = multer();

const { SISWA, PEMBIMBING, INSTRUKTUR } = require("../utils/constants")

var createJurnalHarianController = require("../controllers/jurnalHarian/CreateJurnalHarianController")
var createCatatanPembimbingController = require("../controllers/jurnalHarian/CreateCatatanPembimbingController")
var createCatatanInstrukturController = require("../controllers/jurnalHarian/CreateCatatanInstrukturController")

router.post("/create", verifyToken, checkUserRole(SISWA), upload.single('foto'), createJurnalHarianController)
router.post("/catatan/pembimbing/create", verifyToken, checkUserRole(PEMBIMBING), createCatatanPembimbingController)
router.post("/catatan/instruktur/create", verifyToken, checkUserRole(INSTRUKTUR), createCatatanInstrukturController)

module.exports = router 