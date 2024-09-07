import express from "express"
import auth from "../middleware/auth.js";

import {
  traerDolar, 
  enviarDolar,
  editarManualmente
} from "../controllers/dolaresController.js"

const router = express.Router();
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

export default router;
