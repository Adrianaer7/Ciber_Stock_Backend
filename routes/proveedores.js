const express = require("express");
const router = express.Router();
const proveedoresController = require("../controllers/proveedoresController");
const auth = require("../middleware/auth");

const {agregarProveedor, todosProveedores, elProveedor, editarProveedor, eliminarProveedor, eliminarTodos} = proveedoresController

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

module.exports = router;
