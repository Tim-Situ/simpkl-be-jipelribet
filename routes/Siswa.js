const router = require("express").Router()
var { verifyToken } = require("../middleware/VerifyToken")
var { checkUserRole } = require("../middleware/CekRoles")
const { ADMINSEKOLAH } = require("../utils/constants")

var getAllSiswaController = require("../controllers/siswa/GetAllSiswaController")
var createSiswaController = require("../controllers/siswa/CreateSiswaController")
var updateSiswaController = require("../controllers/siswa/UpdateSiswaController")
var updateStatusSiswaController = require("../controllers/siswa/UpdateStatusSiswaController")
var deleteSiswaController = require("../controllers/siswa/DeleteSiswaController")

router.get("/all", verifyToken, checkUserRole(ADMINSEKOLAH), getAllSiswaController)
router.post("/create", verifyToken, checkUserRole(ADMINSEKOLAH), createSiswaController)
router.put("/update", verifyToken, checkUserRole(ADMINSEKOLAH), updateSiswaController)
router.put("/status", verifyToken, checkUserRole(ADMINSEKOLAH), updateStatusSiswaController)
router.delete("/delete", verifyToken, checkUserRole(ADMINSEKOLAH), deleteSiswaController)

module.exports = router 