const router = require("express").Router()

var getAllBannerController = require("../controllers/banner/GetAllBannerController")

router.get("/all", getAllBannerController)

module.exports = router