const generarId = require("../helpers/generarId")
const emailRegistro = require("../helpers/emailValidacion")
const {validationResult} = require("express-validator") //obtiene el resultado de la validacion que se realiza en la ruta
const jwt = require("jsonwebtoken")
const Usuario = require("../models/Usuario")
const emailOlvidePassword = require("../helpers/emailPassword")

exports.nuevoUsuario = async (req, res) => {

    //Mostrar mensajes de error
    const errores = validationResult(req)   //me devuelve el array con el mensaje de error que definí en la ruta, junto con el campo al que se le atribuye el error, y el body, que es de donde lo traigo
    if(!errores.isEmpty()) {    //si hay errores
        return res.status(400).json({errores: errores.array()}) //muestro el array de errores
        
    }

    //Verificar si el usuario ya existe
    const {email} = req.body    //leo todo el req.body pero solo extraigo el email

    try {
        let usuario = await Usuario.findOne({email})    //si el email del nuevo usuario ya está siendo usado en otro usuario, pongo el usuario ya creado en la variable
        if(usuario) {
            return res.status(400).json({msg: "El usuario ya está registrado"})
        }

        //Crear un nuevo usuario
        usuario = new Usuario(req.body) //creo un nuevo usuario con postman usando el modelo importado 
        usuario.token = generarId() //genero un match.random + date.now
        await usuario.save()
        //Enviar el email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({msg: "Usuario creado correctamente. Revise su email para activar su cuenta."})
        } catch (error) {
            console.log(error)
            res.status(400).send("Hubo un error")   //si hubo un error al insertar un registro, muestra el msj. El 400 es porque es un error del usuario
        }
}

//Confirmar nuevo usuario
exports.confirmar = async (req, res) => {
    const {token} = req.params
    const usuarioConfirmar = await  Usuario.findOne({token})
    if(!usuarioConfirmar) {
        return res.json({msg: "El usuario no existe o ya está verificado"})
    }
    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save()
        res.json({msg: `Hola, ${usuarioConfirmar.nombre}. Tu usuario ha sido verificado`})
    } catch (error) {
        console.log(error)
    }
}

exports.olvidePassword = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({email})
    if(!usuario) {
        return res.status(404).json({msg: "El usuario no existe"})
    } 
    try {
        usuario.token = generarId()
        await usuario.save()

        //Enviar el email de confirmacion
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({msg: "Se han enviado instrucciones a tu email"})
    } catch (error) {
        console.log(error)
    }
}

exports.comprobarToken = async (req, res) => {
    const {token} = req.params
    const tokenValido = await Usuario.findOne({token})
    if(!tokenValido) {
        return res.json({msg: false})
    } 
    res.json({msg: true})
}

exports.nuevoPassword = async (req, res) => {
    const {token} = req.params 
    const {contraseña} = req.body

    const usuario = await Usuario.findOne({token})
    if(!usuario) {
        return res.status(404).json({msg: "Token no válido"})
    }
    usuario.password = contraseña
    usuario.token = ""

    try {
        await usuario.save()
        res.json({msg: "Contraseña modificada correctamente"})
    } catch (error) {
        console.log(error)
    }
}


exports.traerTodos = async (req, res) => {
    const usuarios = await Usuario.find({})
    if(!usuarios) {
        return res.json({msg: "No existen usuarios creados"})
    }
    res.json({usuarios})
}

exports.eliminarTodos = async (req,res) => {
    const usuarios = await Usuario.find({})
    if(!usuarios) {
        return res.json({msg: "No existen usuarios"})
    }
    await Usuario.deleteMany({usuarios})
    res.json({msg: "Todos los usuarios se eliminaron"})
}
