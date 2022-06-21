const Proveedor = require("../models/Proveedor");
require("dotenv").config({ path: "variables.env" });

exports.agregarProveedor = async (req, res, next) => {
  try {
   

    const proveedor = new Proveedor(req.body);
    proveedor.creador = req.usuario.id;
    await proveedor.save();
    res.json({ proveedor });
  } catch (error) {
    console.log(error);
  }
};

exports.todosProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({creador: req.usuario.id}).select("-__v");
    res.json({ proveedores });
  } catch (error) {
    console.log(error);
  }
};

exports.eliminarProveedor = async (req,res) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id)
    if(proveedor.creador.toString() !== req.usuario.id) {
      return res.json({msg: "Acción no válida"})
    }
    if(!proveedor) {
      return res.json({msg: "No se encontró el proveedor a eliminar"})
    }
    await Proveedor.findOneAndRemove({_id: req.params.id})
    res.json({msg: "Proveedor eliminado"})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarTodos = async (req, res) => {
  try {
    let proveedores = await Proveedor.find({creador: req.usuario.id})

    if(proveedores.length == 0) {
      return res.json({msg: "No se encontraron proveedores a eliminar"})
    }

    await Proveedor.deleteMany({creador: req.usuario.id})
    res.json({msg: "Todos los proveedores han sido eliminados"})
  } catch (error) {
    console.log(error)
  }
}
