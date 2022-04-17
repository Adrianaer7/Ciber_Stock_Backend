const Usuario = require("../models/Usuario")
require("dotenv").config.apply({path: "variables.env"})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo
const {validationResult} = require("express-validator")
const generarJWT = require("../helpers/generarJWT")

exports.autenticarUsuario  = async (req, res, next) => {

    //Mostrar mensajes de error
    const errores = validationResult(req)   
    if(!errores.isEmpty()) { 
        return res.status(400).json({errores: errores.array()}) 
    }

    //Buscar el usuario para ver si está registrado
    const {email, password} = req.body

    try {
        const usuario = await Usuario.findOne({email})  //comparo el email del usuario registrado en el email del usuario que quiero autenticarme
        if(!usuario) {  //si no hay email coincidente,
            return res.status(404).json({msg: "El usuario no existe"})
        }
         if (!usuario.confirmado) {
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


exports.usuarioAutenticado = (req, res) => {
    try {
        res.json({usuario: req.usuario})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Hubo un error"})
    }
}