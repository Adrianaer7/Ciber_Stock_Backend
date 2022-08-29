const express = require("express")
const conectarDB = require("./config/db")
const cors = require("cors")
require("dotenv").config({path: 'variables.env'}) 

//Conectar a la DB
conectarDB();  

//Crear el servidor
const app = express();

//Settings CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin:function(origin, callback) {
        if(!origin){ 
            return callback(null, true)
        }else if (whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("Cors Error"))
        }
    }
}
app.use(cors(corsOptions))

//Habilitar leer los valores de un body
app.use(express.json());


//Puerto de la app. Cuando haga el deployment en Heroku se espera que la variable de entorno se llame PORT
const PORT = process.env.PORT || 4000 

//Rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/productos", require("./routes/productos"))
app.use("/api/rubros", require("./routes/rubros"));
app.use("/api/porcentajes", require("./routes/porcentajes"));
app.use("/api/proveedores", require("./routes/proveedores"));
app.use("/api/dolares", require("./routes/dolares"));
app.use("/api/faltantes", require("./routes/faltantes"));
app.use("/api/compras", require("./routes/compras"));
app.use("/api/descargas", require("./routes/descargas"));
app.use("/api/codigos", require("./routes/codigos"));
app.use("/api/garantias", require("./routes/garantias"));


//Arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});