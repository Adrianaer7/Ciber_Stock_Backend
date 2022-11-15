const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");
const auth = require("../middleware/auth");

const {agregarVenta, todasVentas, laVenta, editarVenta, eliminarTodas, eliminarVenta} = ventasController

router.post("/",
  auth,
  agregarVenta
);

router.get("/",
  auth, 
  todasVentas,
);

router.get("/:id",
  auth, 
  laVenta,
);

router.put("/:id",
  auth,
  editarVenta
)

router.delete("/:id",
  auth,
  eliminarVenta
)

router.delete("/",
  auth,
  eliminarTodas
)

module.exports = router;
