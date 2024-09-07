import express from "express"
import { check } from "express-validator";
import auth from "../middleware/auth.js";

import  {
    nuevoUsuario,
    traerTodos,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    eliminarUsuario
} from  "../controllers/usuarioController.js"

const router = express.Router()
router.post("/",
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("email", "El email tiene que ser valido").isEmail(),
        check("password", "La contraseña tiene que tener un minimo de 6 caracteres").isLength({min: 6}),
    ],
    nuevoUsuario
)

router.get("/",
    auth,
    traerTodos
)

router.get("/confirmar/:token",
    confirmar
)
router.post("/olvide-password",
    olvidePassword
)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)

router.delete("/",
    auth,
    eliminarUsuario
)

export default router