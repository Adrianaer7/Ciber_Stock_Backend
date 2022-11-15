const express = require("express");
const router = express.Router();
const porcentajesController = require("../controllers/porcentajesController");
const auth = require("../middleware/auth");

const {agregarPorcentaje, todosPorcentajes, elPorcentaje, editarPorcentaje, eliminarPorcentaje, eliminarTodos} = porcentajesController

router.post("/",
  auth,
  agregarPorcentaje
);

router.get("/",
  auth, 
  todosPorcentajes,
);

router.get("/:id",
  auth, 
  elPorcentaje,
);

router.put("/:id",
  auth,
  editarPorcentaje
)

router.delete("/:id",
  auth,
  eliminarPorcentaje
)

router.delete("/",
  auth,
  eliminarTodos
)

module.exports = router;
