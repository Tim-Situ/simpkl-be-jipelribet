const router = require("express").Router()

var getAllArtikelController = require("../controllers/artikel/GetAllArtikelController")

router.get("/all", getAllArtikelController)

module.exports = router