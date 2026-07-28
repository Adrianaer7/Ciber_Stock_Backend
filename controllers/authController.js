import Usuario from "../models/Usuario.js"
import { generarJWT } from "../helpers/generar.js"
import validarBody from "../helpers/validar.js"

export const autenticarUsuario = async (req, res) => {
    if (!validarBody(req, res)) return

    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(404).json({ msg: "El usuario no existe" })
        }
        if (!usuario.confirmado) {
            return res.status(403).json({ msg: "Tu cuenta no ha sido confirmada" })
        }

        if (!(await usuario.comprobarPassword(password))) {
            return res.status(400).json({ msg: "Contraseña incorrecta" })
        }

        return res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Hubo un error al autenticar" })
    }
}

export const usuarioAutenticado = (req, res) => {
    try {
        return res.json({ usuario: req.usuario })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Hubo un error" })
    }
}
