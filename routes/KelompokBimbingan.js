const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH, PEMBIMBING, SISWA, PERUSAHAAN, INSTRUKTUR } = require("../utils/constants")

var getAllKelompokBimbinganController = require("../controllers/kelompokBimbingan/GetAllKelompokBimbinganController")
var createKelompokBimbinganController = require("../controllers/kelompokBimbingan/CreateKelompokBimbinganController")
var updateKelompokBimbinganController = require("../controllers/kelompokBimbingan/UpdateKelompokBimbinganController")
var getKelompokBimbinganGuruPembimbingController = require("../controllers/kelompokBimbingan/GetKelompokBimbinganGuruPembimbingController")
var getKelompokBimbinganSiswaController = require("../controllers/kelompokBimbingan/GetKelompokBimbinganSiswaController")
var getKelompokBimbinganPerusahaanController = require("../controllers/kelompokBimbingan/GetKelompokBimbinganPerusahaanController")
var getKelompokBimbinganInstrukturController = require("../controllers/kelompokBimbingan/GetKelompokBimbinganInstrukturController")
var deleteKelompokBimbinganInstrukturController = require("../controllers/kelompokBimbingan/DeleteKelompokBimbinganController")

router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllKelompokBimbinganController)
router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createKelompokBimbinganController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateKelompokBimbinganController)
router.get("/guru-pembimbing", verifyToken, checkUserRole(PEMBIMBING), getKelompokBimbinganGuruPembimbingController)
router.get("/siswa", verifyToken, checkUserRole(SISWA), getKelompokBimbinganSiswaController)
router.get("/perusahaan", verifyToken, checkUserRole(PERUSAHAAN), getKelompokBimbinganPerusahaanController)
router.get("/instruktur", verifyToken, checkUserRole(INSTRUKTUR), getKelompokBimbinganInstrukturController)
router.delete("/delete", verifyToken, checkUserRole(ADMINSEKOLAH), deleteKelompokBimbinganInstrukturController)

module.exports = router