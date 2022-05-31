const express = require("express")
const router = express.Router()
const descargasController = require("../controllers/descargasController")
const auth = require("../middleware/auth")

const {generarPDF} = descargasController

router.get("/",
    auth,
    generarPDF
)

module.exports = router;
