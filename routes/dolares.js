const express = require("express");
const router = express.Router();
const dolaresController = require("../controllers/dolaresController");
const auth = require("../middleware/auth");

const {traerDolar, enviarDolar, editarManualmente} = dolaresController

router.post("/",
  auth,
  traerDolar
);

router.get("/",
  auth,
  enviarDolar
)

router.put("/",
  auth,
  editarManualmente
)

module.exports = router;
