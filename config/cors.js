import dotenv from "dotenv"
dotenv.config({path: "variables.env"})

//Settings CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
  origin:function(origin, callback) {
    if(!origin){ 
      return callback(null, true)
    } else if (whitelist.includes(origin)){
      callback(null, true)
    } else{
      callback(new Error("Cors Error"))
    }
  }
}

export default corsOptions