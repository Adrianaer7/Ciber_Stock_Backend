import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config({path: "variables.env"})

const conectarDB = async () => {
    try {   
        await mongoose.connect(process.env.DB_URL)
        console.log("DB conectada") 
    } catch (error) {
        console.log(error)
        process.exit(1) //En caso de que haya un error en la app, detenerla
    }
}

export default conectarDB