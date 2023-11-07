const router = require("express").Router()

var registerAdminSekolahController = require("../controllers/auth/RegistrasiAdminSekolahController")

router.post("/register-admin-sekolah", registerAdminSekolahController)

module.exports = router