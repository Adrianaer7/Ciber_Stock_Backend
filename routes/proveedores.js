const express = require("express");
const router = express.Router();
const proveedoresController = require("../controllers/proveedoresController");
const auth = require("../middleware/auth");

router.post("/", 
    auth, 
    proveedoresController.agregarProveedor
);

router.get("/", 
    auth, 
    proveedoresController.todosProveedores
);

router.get("/:id",
    auth,
    proveedoresController.elProveedor
)

router.put("/:id",
    auth,
    proveedoresController.editarProveedor
)

router.delete("/",
    auth,
    proveedoresController.eliminarTodos
)
router.delete("/:id",
    auth,
    proveedoresController.eliminarProveedor
)

module.exports = router;
