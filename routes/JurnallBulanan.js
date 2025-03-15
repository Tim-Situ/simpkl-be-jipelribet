const multer = require('multer');
const router = require("express").Router()

var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

const upload = multer();

const { SISWA, PEMBIMBING, INSTRUKTUR } = require("../utils/constants")

var createJurnalBulananController = require("../controllers/jurnalBulanan/CreateJurnalBulananController")
var createCatatanPembimbingController = require("../controllers/jurnalBulanan/CreateCatatanPembimbingController")
var createCatatanInstrukturController = require("../controllers/jurnalBulanan/CreateCatatanInstrukturController")
var getJurnalBulananPembimbingInstrukturController = require("../controllers/jurnalBulanan/GetJurnalBulananPembimbingInstrukturController")
var updateJurnalBulananController = require("../controllers/jurnalBulanan/UpdateJurnalBulananController")
var deleteJurnalBulananController = require("../controllers/jurnalHarian/DeleteJurnalBulananController")
var getJurnalBulananSiswaController = require("../controllers/jurnalBulanan/GetJurnalBulananSiswaController")
var getJurnalBulananSiswaNewController = require("../controllers/jurnalBulanan/GetJurnalBulananSiswaNewController")

router.post("/create", verifyToken, checkUserRole(SISWA), upload.single('foto'), createJurnalBulananController)
router.post("/catatan/pembimbing/create", verifyToken, checkUserRole(PEMBIMBING), createCatatanPembimbingController)
router.post("/catatan/instruktur/create", verifyToken, checkUserRole(INSTRUKTUR), createCatatanInstrukturController)
router.get("/bimbingan/get", verifyToken, checkUserRole([PEMBIMBING, INSTRUKTUR]), getJurnalBulananPembimbingInstrukturController)
router.get("/siswa/get", verifyToken, checkUserRole(SISWA), getJurnalBulananSiswaController)
router.get("/siswa/get-new", verifyToken, checkUserRole(SISWA), getJurnalBulananSiswaNewController)
router.put("/update", verifyToken, checkUserRole(SISWA), upload.single('foto'), updateJurnalBulananController)
router.delete("/delete", verifyToken, checkUserRole(SISWA), deleteJurnalBulananController)

module.exports = router