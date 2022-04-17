const express = require("express");
const router = express.Router();
const dolaresController = require("../controllers/dolaresController");
const auth = require("../middleware/auth");

router.post("/",
  auth,
  dolaresController.traerDolar
);

router.get("/",
  auth,
  dolaresController.enviarDolar
)

module.exports = router;
