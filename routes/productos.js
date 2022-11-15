const express = require("express")
const router = express.Router()
const productosController = require("../controllers/productosController")
const auth = require("../middleware/auth")
const {check} = require("express-validator")

const {crearProducto, todosProductos, elProducto, editarProducto, editarProductos, eliminarProducto, eliminarTodos} = productosController

router.post("/",
    auth,
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty()
    ],
    crearProducto
)

router.get("/",
    auth,
    todosProductos
)

router.get("/:id",
    elProducto
)

router.put("/:id",
    auth,
    editarProducto
)
router.put("/",
    auth,
    editarProductos
)

router.delete("/:id", 
    auth,
    eliminarProducto
)

router.delete("/",
    auth,
    eliminarTodos
)

module.exports = router;