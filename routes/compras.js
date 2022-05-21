const express = require("express")
const router = express.Router()
const comprasController = require("../controllers/comprasController")
const auth = require("../middleware/auth")

const {crearCompra, traerCompras, editarCompra} = comprasController

router.post("/",
    auth,
    crearCompra
)

router.get("/",
    auth,
    traerCompras
)

router.put("/:id",
    auth,
    editarCompra
)

module.exports = router;