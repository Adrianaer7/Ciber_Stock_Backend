import Producto from "../models/Producto.js";
import Rubro from "../models/Rubro.js";

export const agregarRubro = async (req, res) => {
  try {
    const {nombre, rentabilidad} = req.body

    const rubroIgual = await Rubro.findOne({nombre})
    
    if(rubroIgual) {
      return res.json({msg: "Este rubro ya existe"})
    }

    const rubro = new Rubro(req.body);
    rubro.datos = (nombre + rentabilidad).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios
    rubro.creador = req.usuario.id;
    await rubro.save();
    res.json({ rubro });
  } catch (error) {
    console.log(error);
  }
};

export const todosRubros = async (req, res) => {
  try {
    const rubros = await Rubro.find({creador: req.usuario.id}).select("-__v");
    res.json({ rubros });
  } catch (error) {
    console.log(error);
  }
};

export const elRubro = async (req,res) => {
  const {id} = req.params

  try {
    const rubro = await Rubro.findById(id)
    if(!rubro) {
      return res.json({msg: "El rubro no existe"})
    }
    res.json({rubro})
  } catch (error) {
    console.log(error)
  }
}

export const editarRubro = async(req,res) => {
  const {id} = req.params
  const {nombre, rentabilidad} = req.body
  
  try {
    let rubro = await Rubro.findById(id)
    
    if(rubro.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "Acción no permitida"})
    }

    if(!rubro) {
      return res.status(404).json({msg: "El rubro no existe"})
    }
    
    let productos = await Producto.find({creador: req.usuario.id})
    
    const productoCambiado = async (producto) => {
      await Producto.findByIdAndUpdate({_id: producto._id}, producto , {new:true} )
    }

    //modifico los productos
    productos.forEach(producto => {
      const {precio_venta, precio_compra_dolar, precio_compra_peso, valor_dolar_compra} = producto

      //cambio el valor del rubro para que no se quede con el valor viejo
      producto.rubroValor = rentabilidad

      //actualizo el precio de venta con las nuevas rentabilidades
      if(precio_compra_dolar && precio_venta > 0) {
        producto.precio_venta = ((precio_compra_dolar * valor_dolar_compra) * (parseInt(Math.round(parseFloat(rentabilidad)))+100) / 100)
        productoCambiado(producto)
      }
      if(precio_compra_peso && precio_venta > 0) {
        producto.precio_venta =  (precio_compra_peso * (parseInt(Math.round(parseFloat(rentabilidad)))+100) / 100)
        productoCambiado(producto)
      }
    })

    const nuevoRubro = req.body
    nuevoRubro.datos = (nombre + rentabilidad).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios
    rubro = await Rubro.findByIdAndUpdate({_id: id}, nuevoRubro, {new: true})
    res.json({rubro})
  } catch (error) {
    console.log(error)
  }
}

export const eliminarRubro = async (req,res) => {
  const {id} = req.params

  try {
    const rubro = await Rubro.findById(id)
    if(rubro.creador.toString() !== req.usuario.id) {
      return res.json({msg: "Acción no válida"})
    }
    if(!rubro) {
      return res.json({msg: "No se encontró el rubro a eliminar"})
    }
    await Rubro.findOneAndRemove({_id: id})
    res.json({msg: "Rubro eliminado"})
  } catch (error) {
    console.log(error)
  }
}

export const eliminarTodos = async (req, res) => {
  try {
    let rubros = await Rubro.find({creador: req.usuario.id})

    if(rubros.length == 0) {
      return res.json({msg: "No se encontraron rubros a eliminar"})
    }

    await Rubro.deleteMany({creador: req.usuario.id})
    res.json({msg: "Todos los rubros han sido eliminados"})
  } catch (error) {
    console.log(error)
  }
}
