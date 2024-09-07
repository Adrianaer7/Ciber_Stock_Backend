import express from "express"
import auth from "../middleware/auth.js"
import {generarPDF} from "../controllers/descargasController.js"

const router = express.Router()
router.get("/",
    auth,
    generarPDF
)

export default router;
