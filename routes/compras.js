import express from "express"
import auth from "../middleware/auth.js"
import  {crearCompra, traerCompras}  from "../controllers/comprasController.js"

const router = express.Router()
router.post("/",
    auth,
    crearCompra
)

router.get("/",
    auth,
    traerCompras
)

export default router;
