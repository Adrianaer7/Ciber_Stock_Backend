const express = require("express")
const router = express.Router()
const {check} = require("express-validator")
const usuarioController = require("../controllers/usuarioController")
const auth = require("../middleware/auth");

const {
    nuevoUsuario,
    traerTodos,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    eliminarTodos
} = usuarioController

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
    eliminarTodos
)

module.exports = router;