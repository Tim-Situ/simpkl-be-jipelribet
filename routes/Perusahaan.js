const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH, PERUSAHAAN } = require("../utils/constants")
const multer = require('multer');

const upload = multer();

var registrasiPerusahaanController = require("../controllers/perusahaan/RegistrasiPerusahaanController")
var getAllPerusahaanController = require("../controllers/perusahaan/GetAllPerusahaanController")
var updateProfilePerusahaanController = require("../controllers/perusahaan/UpdateProfilePerusahaanController")
var createPerusahaanController = require("../controllers/perusahaan/CreateDataPerusahaanController")
var updatePerusahaanController = require("../controllers/perusahaan/UpdatePerusahaanController")

router.post("/registrasi", registrasiPerusahaanController)
router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), upload.single('foto'), createPerusahaanController)
router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllPerusahaanController)
router.put("/update-profile", verifyToken, checkUserRole(PERUSAHAAN), updateProfilePerusahaanController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), upload.single('foto'), updatePerusahaanController)

module.exports = router