const express = require("express");
const router = express.Router();
const rubrosController = require("../controllers/rubrosController");
const auth = require("../middleware/auth");

router.post("/",
  auth,
  rubrosController.agregarRubro
);

router.get("/",
  auth, 
  rubrosController.todosRubros,
);

router.get("/:id",
  auth, 
  rubrosController.elRubro,
);

router.put("/:id",
  auth,
  rubrosController.editarRubro
)

router.delete("/:id",
  auth,
  rubrosController.eliminarRubro
)

router.delete("/",
  auth,
  rubrosController.eliminarTodos
)

module.exports = router;
