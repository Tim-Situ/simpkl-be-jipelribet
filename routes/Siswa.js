const router = require("express").Router()
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var getAllSiswaController = require("../controllers/siswa/GetAllSiswaController")
var createSiswaController = require("../controllers/siswa/CreateSiswaController")
var updateSiswaController = require("../controllers/siswa/UpdateSiswaController")
var updateStatusSiswaController = require("../controllers/siswa/UpdateStatusSiswaController")
var deleteSiswaController = require("../controllers/siswa/DeleteSiswaController")
var importDataSiswaController = require("../controllers/siswa/ImportDataSiswaController")

router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllSiswaController)
router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createSiswaController)
router.post("/import-excel", verifyToken, checkUserRole(ADMINSEKOLAH), upload.single('file'), importDataSiswaController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateSiswaController)
router.put("/status", verifyToken, checkUserRole(ADMINSEKOLAH), updateStatusSiswaController)
router.delete("/delete", verifyToken, checkUserRole(ADMINSEKOLAH), deleteSiswaController)

module.exports = router 