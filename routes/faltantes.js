const express = require("express");
const router = express.Router();
const faltantesController = require("../controllers/faltantesController");
const auth = require("../middleware/auth");

const {crearFaltante, eliminarFaltante, todosFaltantes} = faltantesController

router.put("/:id",
  auth,
  crearFaltante,
  eliminarFaltante
);

router.get("/", 
  auth, 
  todosFaltantes
);


module.exports = router;
