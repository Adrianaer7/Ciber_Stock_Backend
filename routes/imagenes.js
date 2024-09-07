import express from "express"
import auth from "../middleware/auth.js"

import  {guardarImagen} from "../controllers/imagenesController.js"

const router = express.Router()
router.post("/",
    auth,
    guardarImagen
)

export default router
