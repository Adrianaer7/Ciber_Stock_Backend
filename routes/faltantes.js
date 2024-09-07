import express from "express"
import auth from "../middleware/auth.js";

import {
  crearFaltante, 
  eliminarFaltante, 
  todosFaltantes
} from "../controllers/faltantesController.js"

const router = express.Router();
router.put("/:id",
  auth,
  crearFaltante,
  eliminarFaltante
);

router.get("/", 
  auth, 
  todosFaltantes
);

export default router;
