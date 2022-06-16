const express = require ("express")
const garantiasController = require("../controllers/garantiasController");
const auth = require("../middleware/auth");

const router = express.Router()

router.post("/",
    auth,
    garantiasController.crearGarantia
)

router.get("/",
    auth,
    garantiasController.traerGarantias
)

module.exports = router;