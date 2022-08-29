const Rubro = require("../models/Rubro");
require("dotenv").config({ path: "variables.env" });

exports.agregarRubro = async (req, res, next) => {
  try {
   const {nombre, rentabilidad} = req.body

    const rubro = new Rubro(req.body);
    rubro.datos = (nombre + rentabilidad).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios
    rubro.creador = req.usuario.id;
    await rubro.save();
    res.json({ rubro });
  } catch (error) {
    console.log(error);
  }
};

exports.todosRubros = async (req, res) => {
  try {
    const rubros = await Rubro.find({creador: req.usuario.id}).select("-__v");
    res.json({ rubros });
  } catch (error) {
    console.log(error);
  }
};

exports.elRubro = async (req,res) => {
  try {
    const rubro = await Rubro.findById(req.params.id)
    if(!rubro) {
      return res.json({msg: "El rubro no existe"})
    }
    res.json({rubro})
  } catch (error) {
    console.log(error)
  }
}

exports.editarRubro = async(req,res) => {
  const {nombre, rentabilidad} = req.body

  try {
    let rubro = await Rubro.findById(req.params.id)
    
    if(rubro.creador.toString() !== req.usuario.id) {
      return res.status(401).json({msg: "Acción no permitida"})
    }

    if(!rubro) {
      return res.status(404).json({msg: "El rubro no existe"})
    }

    const nuevoRubro = req.body
    nuevoRubro.datos = (nombre + rentabilidad).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios
    rubro = await Rubro.findByIdAndUpdate({_id: req.params.id}, nuevoRubro, {new: true})
    res.json({rubro})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarRubro = async (req,res) => {
  try {
    const rubro = await Rubro.findById(req.params.id)
    if(rubro.creador.toString() !== req.usuario.id) {
      return res.json({msg: "Acción no válida"})
    }
    if(!rubro) {
      return res.json({msg: "No se encontró el rubro a eliminar"})
    }
    await Rubro.findOneAndRemove({_id: req.params.id})
    res.json({msg: "Rubro eliminado"})
  } catch (error) {
    console.log(error)
  }
}

exports.eliminarTodos = async (req, res) => {
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
