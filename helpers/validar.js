import { validationResult } from "express-validator"

/** @returns {boolean} false si ya respondió con error de validación */
const validarBody = (req, res) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    res.status(400).json({ msg: errores.array()[0].msg })
    return false
  }
  return true
}

export default validarBody
