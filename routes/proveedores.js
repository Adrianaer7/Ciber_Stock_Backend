import express from "express";
import auth from "../middleware/auth.js";

import {
    agregarProveedor, 
    todosProveedores,
    elProveedor, 
    editarProveedor, 
    eliminarProveedor, 
    eliminarTodos
} from "../controllers/proveedoresController.js"

const router = express.Router();
router.post("/", 
    auth, 
    agregarProveedor
);

router.get("/", 
    auth, 
    todosProveedores
);

router.get("/:id",
    auth,
    elProveedor
)

router.put("/:id",
    auth,
    editarProveedor
)

router.delete("/:id",
    auth,
    eliminarProveedor
)

router.delete("/",
    auth,
    eliminarTodos
)

export default router;