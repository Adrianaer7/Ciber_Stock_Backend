import express from "express"
import auth from "../middleware/auth.js";

import {
  agregarPorcentaje, 
  todosPorcentajes, 
  elPorcentaje, 
  editarPorcentaje, 
  eliminarPorcentaje, 
  eliminarTodos
} from "../controllers/porcentajesController.js"

const router = express.Router();
router.post("/",
  auth,
  agregarPorcentaje
);

router.get("/",
  auth, 
  todosPorcentajes,
);

router.get("/:id",
  auth, 
  elPorcentaje,
);

router.put("/:id",
  auth,
  editarPorcentaje
)

router.delete("/:id",
  auth,
  eliminarPorcentaje
)

router.delete("/",
  auth,
  eliminarTodos
)

export default router;
