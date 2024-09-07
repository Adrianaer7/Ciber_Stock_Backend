import Usuario from "../models/Usuario.js"
import Compra from "../models/Compra.js"
import Garantia from "../models/Garantia.js"
import Producto from "../models/Producto.js"
import Proveedor from "../models/Proveedor.js"
import Rubro from "../models/Rubro.js"
import Dolar from "../models/Dolar.js"
import {emailRegistro, emailOlvidePassword} from "../helpers/enviarEmail.js"
import { generarId } from "../helpers/generar.js"
import validarBody from "../helpers/validar.js"

export const nuevoUsuario = async (req, res) => {

    //Mostrar mensajes de error
    validarBody(req, res)
    
    //Verificar si el usuario ya existe
    const {email} = req.body 

    try {
        let usuario = await Usuario.findOne({email})
        if(usuario) {
            return res.status(400).json({msg: "El usuario ya está registrado"})
        }

        //Crear un nuevo usuario
        usuario = new Usuario(req.body)
        usuario.token = generarId()
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
        res.status(400).send("Hubo un error")
    }
}

//Confirmar nuevo usuario
export const confirmar = async (req, res) => {
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

export const olvidePassword = async (req, res) => {
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

export const comprobarToken = async (req, res) => {
    const {token} = req.params

    try {
        const tokenValido = await Usuario.findOne({token})
        if(!tokenValido) {
            return res.json({msg: false})
        } 

        res.json({msg: true})
    } catch (error) {
        console.log(error)
    }
}

export const nuevoPassword = async (req, res) => {
    const {token} = req.params 
    const {contraseña} = req.body

    const usuario = await Usuario.findOne({token})
    if(!usuario) {
        return res.status(404).json({msg: "Token no válido"})
    }
    
    try {
        usuario.password = contraseña
        usuario.token = ""
        await usuario.save()
        res.json({msg: "Contraseña modificada correctamente"})
    } catch (error) {
        console.log(error)
    }
}


export const traerTodos = async (req, res) => {
    const usuarios = await Usuario.find({_id: req.usuario.id})

    if(!usuarios) {
        return res.json({msg: "No existen usuarios creados"})
    }
    
    res.json({usuarios})
}

//Elimina el usuario que está logeado
export const eliminarUsuario = async (req,res) => {
    try {
        const resultado = await Usuario.find({_id: req.usuario.id})

        if(!resultado.length) {
            return res.json({msg: "Este usuario no existe"})
        }
        //elimino el contenido de todas las collecciones
        await Promise.all([ 
            Usuario.deleteOne({_id: req.usuario.id}), 
            Compra.deleteMany({creador: req.usuario.id}),  
            Garantia.deleteMany({creador: req.usuario.id}),  
            Producto.deleteMany({creador: req.usuario.id}),  
            Proveedor.deleteMany({creador: req.usuario.id}),  
            Rubro.deleteMany({creador: req.usuario.id}), 
            Dolar.deleteOne({creador: req.usuario.id})
        ])

        res.json({msg: "El usuario ha sido eliminado"})        
    } catch (error) {
        console.log(error)
    }
}
