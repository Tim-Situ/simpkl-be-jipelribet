const router = require("express").Router()
var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

var registerAdminSekolahController = require("../controllers/auth/RegistrasiAdminSekolahController")
var loginController = require("../controllers/auth/LoginController")
var loginMobileController = require("../controllers/auth/LoginMobileController")
var refreshTokenController = require("../controllers/auth/RefreshTokenController")
var getProfileController = require("../controllers/auth/GetProfileController")
var logoutController = require("../controllers/auth/LogoutController")
var updatePasswordController = require("../controllers/auth/UpdatePasswordController")
var setMessageTokenController = require("../controllers/auth/SetMessageTokenController")

router.post("/register-admin-sekolah", registerAdminSekolahController)
router.post("/login", loginController)
router.post("/login-mobile", loginMobileController)
router.get("/refresh-token", refreshTokenController)
router.get("/profile", verifyToken, getProfileController)
router.delete("/logout", logoutController)
router.put("/update-password", verifyToken, updatePasswordController)
router.post("/set-message-token", verifyToken, setMessageTokenController)

module.exports = router