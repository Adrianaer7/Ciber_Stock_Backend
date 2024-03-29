const mongoose = require("mongoose")
require("dotenv").config({path: "variables.env"})

module.exports = conectarDB = async () => {
    try {   
        await mongoose.connect(process.env.DB_URL)
        console.log("DB conectada") 
    } catch (error) {
        console.log(error)
        process.exit(1) //En caso de que haya un error en la app, detenerla
    }
}
