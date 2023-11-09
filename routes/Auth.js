const router = require("express").Router()
var { checkUserRole } = require("../middleware/CekRoles")

var registerAdminSekolahController = require("../controllers/auth/RegistrasiAdminSekolahController")
var loginController = require("../controllers/auth/LoginController")
var refreshTokenController = require("../controllers/auth/RefreshTokenController")

router.post("/register-admin-sekolah", registerAdminSekolahController)
router.post("/login", loginController)
router.get("/refresh-token", refreshTokenController)

module.exports = router