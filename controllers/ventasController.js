const Venta = require("../models/Venta");
require("dotenv").config({ path: "variables.env" });

exports.agregarVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    venta.creador = req.usuario.id;
    await venta.save();
    res.json({ venta });
  } catch (error) {
    console.log(error);
  }
};

exports.todasVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({creador: req.usuario.id}).select("-__v");
    res.json({ ventas });
  } catch (error) {
    console.log(error);
  }
};

exports.laVenta = async (req,res) => {
  try {
    const venta = await Venta.findById(req.params.id)
    if(!venta) {
      return res.json({msg: "La venta no existe"})
    }
    res.json({venta})
  } catch (error) {
    console.log(error)
  }
}

exports.editarVenta = async(req,res) => {
  const {cantidad} = req.body
  try {
    let venta = await Venta.findById(req.params.id)
    
    if(venta.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "Acción no permitida"})
    }

    if(!venta) {
      return res.status(404).json({msg: "La venta no existe"})
    }

    const nuevaVenta = venta
    nuevaVenta.unidades = nuevaVenta.unidades - cantidad
    venta = await Venta.findByIdAndUpdate({_id: req.params.id}, nuevaVenta, {new: true})
    res.json({venta})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarVenta = async (req,res) => {
  try {
    const venta = await Venta.findById(req.params.id)
    if(venta.creador.toString() !== req.usuario.id) {
      return res.json({msg: "Acción no válida"})
    }
    if(!venta) {
      return res.json({msg: "No se encontró la venta a eliminar"})
    }
    await Venta.findOneAndRemove({_id: req.params.id})
    res.json({msg: "Venta eliminada"})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarTodas = async (req, res) => {
  try {
    let ventas = await Venta.find({creador: req.usuario.id})

    if(ventas.length == 0) {
      return res.json({msg: "No se encontraron ventas a eliminar"})
    }

    await Venta.deleteMany({creador: req.usuario.id})
    res.json({msg: "Todos las ventas han sido eliminadas"})
  } catch (error) {
    console.log(error)
  }
}
