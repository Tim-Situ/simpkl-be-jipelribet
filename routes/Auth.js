const router = require("express").Router()
var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

var registerAdminSekolahController = require("../controllers/auth/RegistrasiAdminSekolahController")
var loginController = require("../controllers/auth/LoginController")
var refreshTokenController = require("../controllers/auth/RefreshTokenController")
var getProfileController = require("../controllers/auth/GetProfileController")

router.post("/register-admin-sekolah", registerAdminSekolahController)
router.post("/login", loginController)
router.get("/refresh-token", refreshTokenController)
router.get("/profile", verifyToken, getProfileController)

module.exports = router