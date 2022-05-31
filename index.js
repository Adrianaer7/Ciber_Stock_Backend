const express = require("express")
const conectarDB = require("./config/db")
const cors = require("cors")
require("dotenv").config({path: 'variables.env'})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo

//Conectar a la DB
conectarDB();    //ejecuto la funcion que está en db.js

//Crear el servidor
const app = express();

//Settings CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin:function(origin, callback) {
        if(!origin){ //Postman request have not origin 
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
const PORT = process.env.PORT || 4000   //Si existe process.env.PORT, entonces se asigna el puerto, sino, se asigna puerto 4000. Puede ser cualquier numero menos el puerto del cliente que es 3000

//Rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"))  //el nombre de la api tiene que ser el mismo de cada coleccion en MongoDB
app.use("/api/auth", require("./routes/auth"))
app.use("/api/productos", require("./routes/productos"))
app.use("/api/rubros", require("./routes/rubros"));
app.use("/api/proveedores", require("./routes/proveedores"));
app.use("/api/dolares", require("./routes/dolares"));
app.use("/api/faltantes", require("./routes/faltantes"));
app.use("/api/compras", require("./routes/compras"));
app.use("/api/descargas", require("./routes/descargas"));

//Arrancar la app
app.listen(PORT, () => { //al puerto y al dominio lo va a asignar Heroku
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});