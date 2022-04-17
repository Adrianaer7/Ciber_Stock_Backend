const Rubro = require("../models/Rubro");
require("dotenv").config({ path: "variables.env" }); 
exports.agregarRubro = async (req, res, next) => {

  try {
    const {nombre} = req.body;
    
    let rubros = await Rubro.find({creador: req.usuario.id }); 
    let boolean = rubros.map(rubro => 
      rubro.nombre === nombre ? true : false
    )
    const rubre = boolean.includes(true)

    if (rubre) {
      return res.status(400).json({msg: "El rubro ya está registrado"})
      
    }

    const rubro = new Rubro(req.body);
    rubro.creador = req.usuario.id
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