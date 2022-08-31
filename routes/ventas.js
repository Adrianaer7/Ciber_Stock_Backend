const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");
const auth = require("../middleware/auth");

router.post("/",
  auth,
  ventasController.agregarVenta
);

router.get("/",
  auth, 
  ventasController.todasVentas,
);

router.get("/:id",
  auth, 
  ventasController.laVenta,
);

router.put("/:id",
  auth,
  ventasController.editarVenta
)

router.delete("/:id",
  auth,
  ventasController.eliminarVenta
)

router.delete("/",
  auth,
  ventasController.eliminarTodas
)

module.exports = router;
