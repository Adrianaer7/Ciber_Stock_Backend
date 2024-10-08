import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

const auth = async (req, res, next) => {
    const authHeader = req.get("Authorization")
    if(authHeader) {
        const token = authHeader.split(" ")[1]
         //Validar el token
        try {
            const cifrado = jwt.verify(token, process.env.SECRETA)    //nos permite verificar el token. En cifrado se va a almacenar la id del usuario que creó el proyecto, el momento en el que se creó el usuario y su fecha de expiracion
            if(typeof cifrado === 'object' && cifrado.id) {
                const usuario = await Usuario.findById(cifrado.id).select("nombre email id")  //solo me traigo estos datos
                if(usuario) {
                    req.usuario = usuario
                    next()  //para que se valla al siguiente middleware
                } else {
                    return res.status(401).json({msg: "Token no válido"})
                }
            } else {
                return res.status(401).json({msg: "Token no válido"})
            }
        } catch (error) {
            console.log(error)
            return res.status(401).json({msg: "Token no valido"})  //por si manda un token que expiró, o intenta adivinar el token
        }
    } else {
        res.status(401).json({msg: "No hay token. Permiso no valido"})  
    }
}

export default auth