const multer = require('multer');
const router = require("express").Router()

var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

const upload = multer();

const { SISWA, PEMBIMBING, INSTRUKTUR } = require("../utils/constants")

var createJurnalHarianController = require("../controllers/jurnalHarian/CreateJurnalHarianController")
var createCatatanPembimbingController = require("../controllers/jurnalHarian/CreateCatatanPembimbingController")
var createCatatanInstrukturController = require("../controllers/jurnalHarian/CreateCatatanInstrukturController")
var getJurnalHarianPembimbingInstrukturController = require("../controllers/jurnalHarian/GetJurnalHarianPembimbingInstrukturController")
var updateJurnalHarianController = require("../controllers/jurnalHarian/UpdateJurnalHarianController")
var deleteJurnalHarianController = require("../controllers/jurnalHarian/DeleteJurnalHarianController")
var getJurnalHarianSiswaController = require("../controllers/jurnalHarian/GetJurnalHarianSiswaController")

router.post("/create", verifyToken, checkUserRole(SISWA), upload.single('foto'), createJurnalHarianController)
router.post("/catatan/pembimbing/create", verifyToken, checkUserRole(PEMBIMBING), createCatatanPembimbingController)
router.post("/catatan/instruktur/create", verifyToken, checkUserRole(INSTRUKTUR), createCatatanInstrukturController)
router.get("/bimbingan/get", verifyToken, checkUserRole([PEMBIMBING, INSTRUKTUR]), getJurnalHarianPembimbingInstrukturController)
router.get("/siswa/get", verifyToken, checkUserRole(SISWA), getJurnalHarianSiswaController)
router.put("/update", verifyToken, checkUserRole(SISWA), updateJurnalHarianController)
router.delete("/delete", verifyToken, checkUserRole(SISWA), deleteJurnalHarianController)

module.exports = router