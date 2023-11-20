const multer = require('multer');
const router = require("express").Router()

var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")

const upload = multer();

const { SISWA } = require("../utils/constants")

var createJurnalHarianController = require("../controllers/jurnalHarian/CreateJurnalHarianController")

router.post("/create", verifyToken, checkUserRole(SISWA), upload.single('foto'), createJurnalHarianController)

module.exports = router 