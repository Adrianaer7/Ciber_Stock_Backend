import Dolares from "../models/Dolar.js";

const responderDolar = (res, dolar) => {
  if (!dolar) {
    return res.json({ precio: null, automatico: true })
  }
  return res.json({
    precio: dolar.precio,
    automatico: dolar.automatico,
  })
}

export const traerDolar = async (req, res) => {
  try {
    const { precio } = req.body
    const elDolar = await Dolares.findOne({ creador: req.usuario.id })

    if (elDolar) {
      if (elDolar.precio === precio) {
        return responderDolar(res, elDolar)
      }
      await Dolares.deleteMany({ creador: req.usuario.id });
    }

    let dolar = new Dolares(req.body);
    dolar.creador = req.usuario.id
    await dolar.save();
    return responderDolar(res, dolar)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Error al guardar el dólar" })
  }
};

export const editarManualmente = async (req, res) => {
  try {
    let dolar = await Dolares.findOne({ creador: req.usuario.id })
    if (!dolar) {
      return res.status(404).json({ msg: "No hay cotización de dólar" })
    }

    if (req.body.dolarManual) {
      const { dolarManual } = req.body
      const nuevoDolar = { ...dolarManual, automatico: false }
      dolar = await Dolares.findByIdAndUpdate({ _id: dolar._id }, nuevoDolar, { new: true })
      return responderDolar(res, dolar)
    }

    dolar = await Dolares.findByIdAndUpdate(
      { _id: dolar._id },
      { automatico: true },
      { new: true }
    )
    return responderDolar(res, dolar)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Error al editar el dólar" })
  }
}

export const enviarDolar = async (req, res) => {
  try {
    const dolar = await Dolares.findOne({ creador: req.usuario.id }).select("-__v -_id")
    return responderDolar(res, dolar)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Error al obtener el dólar" })
  }
}
