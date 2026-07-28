import Producto from "../models/Producto.js";

export const crearFaltante = async (req, res, next) => {
  const { id } = req.params

  try {
    let producto = await Producto.findById(id)
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" })
    }

    if (producto.creador.toString() !== req.usuario.id) {
      return res.status(400).json({ msg: "No se puede agregar faltante. Acceso denegado" })
    }
    if (!producto.faltante) {
      producto.faltante = true;
      producto.limiteFaltante = producto.disponibles
      producto.añadirFaltante = true

      producto = await Producto.findByIdAndUpdate({ _id: req.params.id }, producto, { new: true });
      return res.json({ producto });
    }
    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Error al crear faltante" })
  }
};

export const eliminarFaltante = async (req, res) => {
  const { id } = req.params

  try {
    let producto = await Producto.findById(id)
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" })
    }

    if (producto.creador.toString() !== req.usuario.id) {
      return res.status(400).json({ msg: "No se puede eliminar el faltante. Acceso denegado" });
    }

    if (producto.faltante) {
      producto.faltante = false;
      producto.limiteFaltante = null
      producto.añadirFaltante = false

      producto = await Producto.findByIdAndUpdate({ _id: id }, producto, { new: true });
      return res.json({ msg: "Faltante eliminado", producto });
    }

    return res.json({ msg: "El producto no estaba marcado como faltante", producto })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Error al eliminar faltante" })
  }
}

export const todosFaltantes = async (req, res) => {
  try {
    const faltantes = await Producto.find({ creador: req.usuario.id, faltante: true }).select("-__v");
    return res.json({ faltantes })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error al listar faltantes" })
  }
};
