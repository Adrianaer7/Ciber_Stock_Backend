import express from "express"
import { check } from "express-validator"
import rateLimit from "express-rate-limit"
import auth from "../middleware/auth.js"
import {autenticarUsuario, usuarioAutenticado} from "../controllers/authController.js"

const loginLimiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { msg: "Demasiadas solicitudes. Intentá de nuevo en unos segundos." }
})

const router = express.Router()
router.post("/",
    loginLimiter,
    [
       check("email", "Agrega un email valido").isEmail(),
       check("password", "El password no puede ir vacio").not().isEmpty() 
    ],
    autenticarUsuario
)

router.get("/",
    auth,
    usuarioAutenticado
)

export default router