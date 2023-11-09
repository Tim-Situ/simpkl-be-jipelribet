const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH, PERUSAHAAN } = require("../utils/constants")

var registrasiPerusahaanController = require("../controllers/perusahaan/RegistrasiPerusahaanController")
var getAllPerusahaanController = require("../controllers/perusahaan/GetAllPerusahaanController")
var updateProfilePerusahaanController = require("../controllers/perusahaan/UpdateProfilePerusahaanController")

router.post("/registrasi", registrasiPerusahaanController)
router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllPerusahaanController)
router.put("/update-profile", verifyToken, checkUserRole(PERUSAHAAN), updateProfilePerusahaanController)

module.exports = router