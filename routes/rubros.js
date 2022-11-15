const express = require("express");
const router = express.Router();
const rubrosController = require("../controllers/rubrosController");
const auth = require("../middleware/auth");

const {agregarRubro, todosRubros, elRubro, editarRubro, eliminarRubro, eliminarTodos} = rubrosController

router.post("/",
  auth,
  agregarRubro
);

router.get("/",
  auth, 
  todosRubros,
);

router.get("/:id",
  auth, 
  elRubro,
);

router.put("/:id",
  auth,
  editarRubro
)

router.delete("/:id",
  auth,
  eliminarRubro
)

router.delete("/",
  auth,
  eliminarTodos
)

module.exports = router;
