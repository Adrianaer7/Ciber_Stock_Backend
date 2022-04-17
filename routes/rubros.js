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
  rubrosController.todosRubros
);

router.delete("/",
  auth,
  rubrosController.eliminarTodos
)

module.exports = router;
