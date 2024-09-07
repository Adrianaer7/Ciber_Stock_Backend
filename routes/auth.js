import express from "express"
import { check } from "express-validator"
import auth from "../middleware/auth.js"
import {autenticarUsuario, usuarioAutenticado} from "../controllers/authController.js"

const router = express.Router()
router.post("/",
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