const express = require ("express")
const router = express.Router()
const garantiasController = require("../controllers/garantiasController");
const auth = require("../middleware/auth");

const {crearGarantia, traerGarantias} = garantiasController

router.post("/",
    auth,
    crearGarantia
)

router.get("/",
    auth,
    traerGarantias
)

module.exports = router;