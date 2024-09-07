import express from "express"
import auth from "../middleware/auth.js"

import {crearGarantia, traerGarantias} from "../controllers/garantiasController.js"

const router = express.Router()
router.post("/",
    auth,
    crearGarantia
)

router.get("/",
    auth,
    traerGarantias
)

export default router;