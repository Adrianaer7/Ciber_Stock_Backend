import express from "express"
import auth from "../middleware/auth.js"
import { check } from "express-validator"

import  {
    crearProducto, 
    todosProductos, 
    elProducto, 
    editarProducto, 
    editarProductos, 
    eliminarProducto, 
    eliminarTodos
} from "../controllers/productosController.js"

const router = express.Router()
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

export default router