import Usuario from "../models/Usuario.js"
import { generarJWT } from "../helpers/generar.js"
import validarBody from "../helpers/validar.js"

export const autenticarUsuario  = async (req, res) => {

    //Mostrar mensajes de error
    validarBody(req, res)

    //Buscar el usuario para ver si está registrado
    const {email, password} = req.body

    try {
        const usuario = await Usuario.findOne({email})
        if(!usuario) {  //si no hay email coincidente,
            return res.status(404).json({msg: "El usuario no existe"})
        }
        if(!usuario.confirmado) {
        //si no hay email coincidente,
        return res.status(403).json({ msg: "Tu cuenta no ha sido confirmada" });
        }

        //Revisar que el password sea correcto
        if(!await usuario.comprobarPassword(password)) {  //Funcion que se declara en el modelo Usuario. si el password es incorrecto
            return res.status(400).json({msg: "Contraseña incorrecta"})
        } else {
            res.json({id: usuario._id, nombre: usuario.nombre, email: usuario.email, token: generarJWT(usuario._id)})
        }
    } catch (error) {
        console.log(error)

    }
}


export const usuarioAutenticado = (req, res) => {
    try {
        res.json({usuario: req.usuario})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Hubo un error"})
    }
}