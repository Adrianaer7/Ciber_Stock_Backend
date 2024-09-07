import express from "express"
import conectarDB from "./config/db.js"
import cors from "cors"
import dotenv from "dotenv"
import corsOptions from "./config/cors.js"

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

//Conectar a la DB
conectarDB();  

//Importar las .env
dotenv.config({path: "variables.env"})

//Crear el servidor
const app = express();

//CORS
app.use(cors(corsOptions))

//Habilitar leer los valores de un body
app.use(express.json());

//Habilitar carpeta pública. De esta manera puedo acceder a los archivos que hay en la carpeta uploads poniendo el nombre del archivo en la url. Lo hago en [enlace].js
app.use(express.static("uploads"))

//Puerto de la app. Cuando haga el deployment en Heroku se espera que la variable de entorno se llame PORT
const PORT = process.env.PORT || 4000 

//Rutas de la app
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


//Arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});