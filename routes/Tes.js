const router = require("express").Router()
var { checkUserRole } = require("../middleware/CekRoles")
var { verifyToken } = require("../middleware/VerifyToken")
const multer = require('multer');

const upload = multer();

const { ADMINSEKOLAH, PEMBIMBING, } = require("../utils/constants")

var tesController = require("../controllers/tes/TesGetControllers")
var uploadController = require("../controllers/tes/TesUploadController")
var deleteFileController = require("../controllers/tes/DeleteFileController")

router.get("/get", verifyToken, checkUserRole(PEMBIMBING), tesController)
router.post("/upload", upload.single('gambar'), uploadController)
router.delete("/delete-file", deleteFileController)

module.exports = router 