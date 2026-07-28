import { describe, it } from "node:test"
import assert from "node:assert/strict"
import validarBody from "../helpers/validar.js"

/** Copia mínima para tests (mismo contrato que cliente/helpers/axiosError.js) */
const mensajeAxios = (error, fallback = "Ocurrió un error") => {
  if (error?.response?.data?.msg) return error.response.data.msg
  if (typeof error?.response?.data === "string") return error.response.data
  if (error?.message === "Network Error") return "No se pudo conectar con el servidor"
  if (error?.code === "ECONNABORTED") return "La solicitud tardó demasiado"
  return fallback
}

const mockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(payload) {
      this.body = payload
      return this
    }
  }
  return res
}

describe("validarBody", () => {
  it("devuelve true cuando no hay errores de validación", () => {
    const req = { body: { email: "a@b.com", password: "123456" } }
    const res = mockRes()
    assert.equal(validarBody(req, res), true)
    assert.equal(res.body, null)
  })
})

describe("mensajeAxios", () => {
  it("prioriza msg del backend", () => {
    assert.equal(
      mensajeAxios({ response: { data: { msg: "Contraseña incorrecta" } } }),
      "Contraseña incorrecta"
    )
  })

  it("maneja Network Error", () => {
    assert.equal(
      mensajeAxios({ message: "Network Error" }),
      "No se pudo conectar con el servidor"
    )
  })

  it("usa fallback si no hay response", () => {
    assert.equal(mensajeAxios({}, "Fallback"), "Fallback")
  })
})
