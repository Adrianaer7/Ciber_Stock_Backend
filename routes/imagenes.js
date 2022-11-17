const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const imagenesController = require("../controllers/imagenesController")
const {guardarImagen} = imagenesController

router.post("/",
    auth,
    guardarImagen
)

module.exports = router;
