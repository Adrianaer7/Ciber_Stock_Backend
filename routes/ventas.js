import express from "express"
import auth from "../middleware/auth.js";

import {
  agregarVenta, 
  todasVentas, 
  laVenta, 
  editarVenta, 
  eliminarTodas, 
  eliminarVenta
} from "../controllers/ventasController.js"

const router = express.Router();
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

export default router;