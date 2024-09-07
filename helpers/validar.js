import { validationResult } from "express-validator"

const validarBody = (req, res) => {
  const errores = validationResult(req)   //me devuelve el array con el mensaje de error que definí en la ruta, junto con el campo al que se le atribuye el error, y el body, que es de donde lo traigo
  if(!errores.isEmpty()) {    //si hay errores
    return res.status(400).json({msg: errores.array()[0].msg}) //muestro el array de errores
  }
}

export default validarBody