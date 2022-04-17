const express = require("express")
const conectarDB = require("./config/db")
const cors = require("cors")

//Conectar a la DB
conectarDB()    //ejecuto la funcion que está en db.js

//Crear el servidor
const app = express()

//Habilitar Cors
app.use(cors())

//Habilitar leer los valores de un body
app.use(express.json())


//Puerto de la app. Cuando haga el deployment en Heroku se espera que la variable de entorno se llame PORT
const port = process.env.PORT || 4000   //Si existe process.env.PORT, entonces se asigna el puerto, sino, se asigna puerto 4000. Puede ser cualquier numero menos el puerto del cliente que es 3000

//Rutas de la app
app.use("/api/usuarios", require("./routes/usuarios"))  //el nombre de la api tiene que ser el mismo de cada coleccion en MongoDB
app.use("/api/auth", require("./routes/auth"))
app.use("/api/productos", require("./routes/productos"))
app.use("/api/rubros", require("./routes/rubros"));
app.use("/api/proveedores", require("./routes/proveedores"));
app.use("/api/dolares", require("./routes/dolares"));
app.use("/api/faltantes", require("./routes/faltantes"));

//Arrancar la app
app.listen(port, "0.0.0.0", () => { //al puerto y al dominio lo va a asignar Heroku
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})