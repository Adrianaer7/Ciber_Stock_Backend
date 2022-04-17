const express = require("express");
const router = express.Router();
const faltantesController = require("../controllers/faltantesController");
const auth = require("../middleware/auth");

router.put("/:id",
  auth,
  faltantesController.crearFaltante,
  faltantesController.eliminarFaltante
);

router.get("/", 
  auth, 
  faltantesController.todosFaltantes
);


module.exports = router;
