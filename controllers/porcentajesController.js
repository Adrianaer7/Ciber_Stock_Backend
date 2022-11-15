const Porcentaje = require("../models/Porcentaje");

exports.agregarPorcentaje = async (req, res) => {
  try {
   const {nombre, comision, tipo} = req.body

    const porcentaje = new Porcentaje(req.body);
    porcentaje.datos = (nombre + comision + tipo).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios
    porcentaje.creador = req.usuario.id;
    await porcentaje.save();
    res.json({ porcentaje });
  } catch (error) {
    console.log(error);
  }
};

exports.todosPorcentajes = async (req, res) => {
  try {
    const porcentajes = await Porcentaje.find({creador: req.usuario.id}).select("-__v");
    res.json({ porcentajes });
  } catch (error) {
    console.log(error);
  }
};

exports.elPorcentaje = async (req,res) => {
  const {id} = req.params

  try {
    const porcentaje = await Porcentaje.findById(id)
    if(!porcentaje) {
      return res.json({msg: "El porcentaje no existe"})
    }
    res.json({porcentaje})
  } catch (error) {
    console.log(error)
  }
}

exports.editarPorcentaje = async(req,res) => {
  const {id} = req.params
  const {nombre, comision, tipo} = req.body

  try {
    let porcentaje = await Porcentaje.findById(id)
    
    if(porcentaje.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "Acción no permitida"})
    }

    if(!porcentaje) {
      return res.status(404).json({msg: "El porcentaje no existe"})
    }

    const nuevoPorcentaje = req.body
    nuevoPorcentaje.datos = (nombre + comision + tipo).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios
    porcentaje = await Porcentaje.findByIdAndUpdate({_id: id}, nuevoPorcentaje, {new: true})
    res.json({porcentaje})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarPorcentaje = async (req,res) => {
  const {id} = req.params
  
  try {
    const porcentaje = await Porcentaje.findById(id)
    if(porcentaje.creador.toString() !== req.usuario.id) {
      return res.json({msg: "Acción no válida"})
    }
    if(!porcentaje) {
      return res.json({msg: "No se encontró el porcentaje a eliminar"})
    }
    await Porcentaje.findOneAndRemove({_id: id})
    res.json({msg: "Porcentaje eliminado"})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarTodos = async (req, res) => {
  try {
    let porcentajes = await Porcentaje.find({creador: req.usuario.id})

    if(porcentajes.length == 0) {
      return res.json({msg: "No se encontraron porcentajes a eliminar"})
    }

    await Porcentaje.deleteMany({creador: req.usuario.id})
    res.json({msg: "Todos los porcentajes han sido eliminados"})
  } catch (error) {
    console.log(error)
  }
}
