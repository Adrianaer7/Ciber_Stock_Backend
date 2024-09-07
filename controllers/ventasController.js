import Venta from "../models/Venta.js";
import Producto from "../models/Producto.js";

export const agregarVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    venta.creador = req.usuario.id;
    await venta.save();
    res.json({ venta });
  } catch (error) {
    console.log(error);
  }
};

export const todasVentas = async (req, res) => {
  try {
    const ventas = await Venta.find({creador: req.usuario.id}).select("-__v").sort({creado: "desc"});
    res.json({ ventas });
  } catch (error) {
    console.log(error);
  }
};

export const laVenta = async (req,res) => {
  const {id} = req.params

  try {
    const venta = await Venta.findById(id)
    if(!venta) {
      return res.json({msg: "La venta no existe"})
    }
    res.json({venta})
  } catch (error) {
    console.log(error)
  }
}

export const editarVenta = async(req,res) => {
  const {id} = req.params
  const {cantidad, idProducto} = req.body

  try {
    const producto = await Producto.findOne({_id: idProducto})
    let venta = await Venta.findById(id)
    
    if(!venta) {
      return res.status(404).json({msg: "La venta no existe"})
    }

    if(venta.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "Acción no permitida"})
    }
    
    if(!producto) {
      return res.json({msg: "No se pueden devolver las unidades porque el producto ya no existe"})
    }

    //Devuelvo la unidad vendida al producto
    let nuevoProducto = producto
    nuevoProducto.disponibles = nuevoProducto.disponibles + cantidad
    await Producto.findByIdAndUpdate({_id: idProducto}, nuevoProducto, {new: true})
    
    //Descuento las unidades vendidas de la venta
    const nuevaVenta = venta
    nuevaVenta.unidades = nuevaVenta.unidades - cantidad
    venta = await Venta.findByIdAndUpdate({_id: id}, nuevaVenta, {new: true})
    res.json({venta})
  } catch (error) {
    console.log(error)
  }
  
}

export const eliminarVenta = async (req,res) => {
  const {id} = req.params

  try {
    const venta = await Venta.findById(id)
    const {idProducto, unidades} = venta
    
    if(!venta) {
      return res.json({msg: "No se encontró la venta a eliminar"})
    }

    if(venta.creador.toString() !== req.usuario.id) {
      return res.json({msg: "Acción no válida"})
    }

    //Devuelvo la unidad vendida al producto
    const producto = await Producto.findOne({_id: idProducto})
    if(!producto) {
      return res.json({msg: "No se pueden devolver las unidades porque el producto ya no existe"})
    }

    let nuevoProducto = producto
    nuevoProducto.disponibles = nuevoProducto.disponibles + unidades
    
    await Producto.findByIdAndUpdate({_id: idProducto}, nuevoProducto, {new: true})
    
    //Elimino la venta realizada
    await Venta.findOneAndRemove({_id: id})
    res.json({msg: "Venta eliminada"})
  } catch (error) {
    console.log(error)
  }
}

export const eliminarTodas = async (req, res) => {
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
