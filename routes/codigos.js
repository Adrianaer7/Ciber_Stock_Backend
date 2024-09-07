import express from "express"
import auth from "../middleware/auth.js"
import {todosCodigos} from "../controllers/codigosController.js"

const router = express.Router()
router.get("/",
    auth,
    todosCodigos
)

export default router;