const express = require("express");
const router = express.Router();
const porcentajesController = require("../controllers/porcentajesController");
const auth = require("../middleware/auth");

router.post("/",
  auth,
  porcentajesController.agregarPorcentaje
);

router.get("/",
  auth, 
  porcentajesController.todosPorcentajes,
);

router.get("/:id",
  auth, 
  porcentajesController.elPorcentaje,
);

router.put("/:id",
  auth,
  porcentajesController.editarPorcentaje
)

router.delete("/:id",
  auth,
  porcentajesController.eliminarPorcentaje
)

router.delete("/",
  auth,
  porcentajesController.eliminarTodos
)

module.exports = router;
