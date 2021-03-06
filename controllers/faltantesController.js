const Producto = require("../models/Producto");
require("dotenv").config({ path: "variables.env" }); //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo

//cuando haga click en el boton añadir faltante, viene a esta funcion
exports.crearFaltante = async (req, res, next) => {
  try {
    let producto = await Producto.findById(req.params.id)

    if(producto.creador.toString() !== req.usuario.id) {
      return res.status(400).json({msg: "No se puede agregar faltante. Acceso denegado"})
    }
    if(producto.faltante === false) { //compprueba que no sea un producto que ya esté como faltante
      producto.faltante = true;
      producto.limiteFaltante = producto.disponibles  //si tengo poco stock, agrego ese stock como un numero de aviso para faltante
      producto.añadirFaltante = true  //por si al crear el producto no se puso como añadir alerta de faltante, se lo agrego

      const nuevoFaltante = producto;
      producto = await Producto.findByIdAndUpdate({ _id: req.params.id }, nuevoFaltante, { new: true });
      return res.json({ producto });
    } else {
      return next()
    }
  } catch (error) {
    console.log(error)
  }
};

//cuando ponga el el boton de quitar faltante
exports.eliminarFaltante = async (req, res, next) => {
  let producto = await Producto.findById(req.params.id)

  if (producto.creador.toString() !== req.usuario.id) {
    return res.status(400).json({ msg: "No se puede eliminar el faltante. Acceso denegado" });
  }

  if(producto.faltante === true) {  //solo si está como true lo elimina
      producto.faltante = false;  //lo quito de faltante
      producto.limiteFaltante = null  //elimino el numero para la alerta e faltante
      producto.añadirFaltante = false //deshabilito el boton de añadir alerta
      
      const quitarFaltante = producto;
      producto = await Producto.findByIdAndUpdate({ _id: req.params.id }, quitarFaltante, { new: true });
      return res.json({ msg: "Faltante eliminado" });

    }
}

exports.todosFaltantes = async (req, res) => {
  try {
    const faltantes = await Producto.find({creador: req.usuario.id, faltante: true}).select("-__v"); //trae todo menos ese campo
    res.json({faltantes})
  } catch (error) {
    console.log(error);
  }
};

