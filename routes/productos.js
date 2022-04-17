const express = require("express")
const router = express.Router()
const productosController = require("../controllers/productosController")
const auth = require("../middleware/auth")
const {check} = require("express-validator")

router.post("/",
    auth,
    [
        check("nombre", "El nombre es obligatorio").not().isEmpty()
    ],
    productosController.crearProducto
)

router.get("/",
    auth,
    productosController.todosProductos
)

router.get("/:id",
    productosController.elProducto
)

router.put("/:id",
    auth,
    productosController.editarProducto
)
router.put("/",
    auth,
    productosController.editarProductos
)

router.delete("/:id", 
    auth,
    productosController.eliminarProducto
)

router.delete("/",
    auth,
    productosController.eliminarTodos
)

module.exports = router;