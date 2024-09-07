import express from "express"
import auth from "../middleware/auth.js";

import {
  agregarRubro, 
  todosRubros, 
  elRubro, 
  editarRubro, 
  eliminarRubro, 
  eliminarTodos
} from "../controllers/rubrosController.js"

const router = express.Router();
router.post("/",
  auth,
  agregarRubro
);

router.get("/",
  auth, 
  todosRubros,
);

router.get("/:id",
  auth, 
  elRubro,
);

router.put("/:id",
  auth,
  editarRubro
)

router.delete("/:id",
  auth,
  eliminarRubro
)

router.delete("/",
  auth,
  eliminarTodos
)

export default router;
