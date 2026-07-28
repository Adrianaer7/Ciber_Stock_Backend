import { Server } from "socket.io"
import jwt from "jsonwebtoken"
import Usuario from "../models/Usuario.js"

let io = null
const activeSessions = new Map() // userId -> { clientId, nombre }

const getAllowedOrigins = () => {
  const origins = [process.env.FRONTEND_URL].filter(Boolean)
  // Permitir también Angular si se define
  if (process.env.FRONTEND_URL_ANGULAR) {
    origins.push(process.env.FRONTEND_URL_ANGULAR)
  }
  return origins
}

export const initSocket = (httpServer) => {
  const allowedOrigins = getAllowedOrigins()

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error("Cors Error"))
        }
      },
      credentials: true,
    },
  })

  io.on("connection", async (socket) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authentication

    const usuario = await verifySocketToken(token)
    if (!usuario) {
      socket.disconnect(true)
      return
    }

    const userId = usuario._id.toString()

    // Sesión única (como Nest): rechaza la nueva si ya hay una activa
    if (activeSessions.has(userId)) {
      console.log(`Usuario ${usuario.nombre} desconectado: ya tiene sesión socket activa`)
      socket.disconnect(true)
      return
    }

    activeSessions.set(userId, { clientId: socket.id, nombre: usuario.nombre })
    console.log(`Socket conectado: ${usuario.nombre}`)

    socket.on("disconnect", () => {
      const session = activeSessions.get(userId)
      // Solo borrar si es la misma conexión (evita bug de Nest al rechazar duplicados)
      if (session?.clientId === socket.id) {
        activeSessions.delete(userId)
        console.log(`Socket desconectado: ${usuario.nombre}`)
      }
    })
  })

  return io
}

const verifySocketToken = async (token) => {
  if (!token) return null
  try {
    const payload = jwt.verify(token, process.env.SECRETA)
    if (!payload?.id) return null

    const usuario = await Usuario.findById(payload.id).select("nombre email confirmado")
    if (!usuario || !usuario.confirmado) return null
    return usuario
  } catch (error) {
    return null
  }
}

export const getIO = () => io

export const emitirProductos = () => {
  if (!io) return
  io.emit("product-updated")
}

export const emitirCompras = () => {
  if (!io) return
  io.emit("purchase-updated")
}

export const emitirRubros = () => {
  if (!io) return
  io.emit("rubros-updated")
}
