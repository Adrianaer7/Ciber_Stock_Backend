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

router.delete("/",
    auth,
    proveedoresController.eliminarTodos
)

module.exports = router;
