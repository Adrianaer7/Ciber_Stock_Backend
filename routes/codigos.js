const express = require("express")
const router = express.Router()
const codigosController = require("../controllers/codigosController")
const auth = require("../middleware/auth")

router.get("/",
    auth,
    codigosController.todosCodigos
)

module.exports = router