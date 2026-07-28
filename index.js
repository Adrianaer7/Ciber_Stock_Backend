import express from "express"
import http from "http"
import conectarDB from "./config/db.js"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import corsOptions from "./config/cors.js"
import { initSocket } from "./config/socket.js"

import {
  usuariosRouter,
  authRouter,
  productosRouter,
  imagenesRouter,
  rubrosRouter,
  porcentajesRouter,
  proveedoresRouter,
  dolaresRouter,
  faltantesRouter,
  comprasRouter,
  ventasRouter,
  descargasRouter,
  codigosRouter,
  garantiasRouter
} from "./pathroutes/allRoutes.js"

dotenv.config({ path: "variables.env", quiet: true })
conectarDB();

const app = express();
const httpServer = http.createServer(app)

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))
app.use(cors(corsOptions))
app.use(express.json({ limit: "5mb" }));
app.use(express.static("uploads"))

const PORT = process.env.PORT || 4000

app.use("/api/usuarios", usuariosRouter)
app.use("/api/auth", authRouter)
app.use("/api/productos", productosRouter)
app.use("/api/imagenes", imagenesRouter)
app.use("/api/rubros", rubrosRouter);
app.use("/api/porcentajes", porcentajesRouter);
app.use("/api/proveedores", proveedoresRouter);
app.use("/api/dolares", dolaresRouter);
app.use("/api/faltantes", faltantesRouter);
app.use("/api/compras", comprasRouter);
app.use("/api/ventas", ventasRouter);
app.use("/api/descargas", descargasRouter);
app.use("/api/codigos", codigosRouter);
app.use("/api/garantias", garantiasRouter);

app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).json({ msg: err.message || "Error interno del servidor" })
})

if (process.env.NODE_ENV !== "test") {
  initSocket(httpServer)
  httpServer.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
  });
}

export default app
