const Producto = require("../models/Producto")
const {validationResult} = require("express-validator")
require("dotenv").config({path: 'variables.env'})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo

exports.crearProducto = async (req, res, next) => {
    //Revisar si hay errores
    const errores = validationResult(req)   
    if(!errores.isEmpty()) {  
        return res.status(400).json({errores: errores.array()}) 
    }

    try {
        const { codigo, nombre, marca, modelo } = req.body;
        const products = await Producto.find({ creador: req.usuario.id });  //obtengo solo los productos del usuario que esta logeado
        let boolean = products.map((producto) =>   //recorro los productos y consulto si existe un producto con el mismo codigo, devuelvo un array con false o true si coincide
          producto.codigo === parseInt(codigo) ? true : false
        )
        const code = boolean.includes(true)    //consulta si hay algun true en el array

        if(code) {  //si hay coincidencias, devuelvo msj, sino, creo el producto
            return res.status(400).json({msg: "Ya existe este codigo"})
        } 

        const producto = new Producto(req.body);
        producto.creador = req.usuario.id;
        producto.precio_venta_tarjeta = 0
        producto.precio_venta_efectivo = 0
        
        if(!producto.precio_venta) {    //para que al mostrar la lista, pueda ordenar los productos segun precio. Si el precio está como null no lo puedo ordenar.
            producto.precio_venta_conocidos = 0
        }
        if(producto.disponibles <= producto.limiteFaltante && producto.añadirFaltante) { //si el stock es menor o igual que el numero de alerta que le puse y el botón de alerta esta activado, lo pongo como faltante. Si no pongo la condicion de añadirFaltante, el stock puede ser 0 y limite 0 y me lo va a agregar automaticamente a faltante
            producto.faltante = true
        }

        producto.descripcion = codigo + " " + nombre + " " + marca + " " + modelo;
        await producto.save()
        res.json({producto})
        
    } catch (error) {
        console.log(error)
    }
}

exports.todosProductos = async (req, res) => {
    try {
        const productos = await Producto.find({creador: req.usuario.id}).select("-__v")    //trae todo menos ese campo
        res.json({productos})
    } catch (error) {
        console.log(error)
    }
}

exports.elProducto = async (req, res, next) => {
    const url = req.params.id
    try {
        if (!url.match(/^[0-9a-fA-F]{24}$/)) {
            res.json({redireccionar: true}) //creo una variable y le asigno true si la url que me llega no es correcta
        }
        const producto = await Producto.findById(url)
        if(!producto) {
            res.json({redireccionar: true})
        }
        
        res.json({producto})
        
    } catch (error) {
        console.log(error)
    }   
}

exports.editarProducto = async (req, res) => {
   try {
       const {codigo, nombre, marca, modelo} = req.body
       
       let producto = await Producto.findById(req.params.id)

       if(producto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: "No autorizado"})
       }
       if(!producto) { 
           return res.status(404).json({msg: "El producto no existe"})
       }

       const nuevoProducto = req.body

       nuevoProducto.descripcion = (codigo + " " + nombre + " " + marca + " " + modelo).trim().replace(/\s\s+/g, ' ')   //el trim elimina los espacios en blanco al principio y al final, y el replace quita 2 o mas espacio entre palabra y palabra

       if(!nuevoProducto.precio_venta) {    //para que al mostrar la lista, pueda ordenar los productos segun precio.
            nuevoProducto.precio_venta_conocidos = 0;
       }
       if(nuevoProducto.disponibles <= nuevoProducto.limiteFaltante && nuevoProducto.añadirFaltante) {
            nuevoProducto.faltante = true
        } else {
            nuevoProducto.faltante = false
        }
       producto = await Producto.findByIdAndUpdate({_id: req.params.id}, nuevoProducto, {new: true})
       res.json({producto})
   } catch (error) {
       console.log(error)
   }
}

exports.editarProductos = async (req, res) => {
    const {precio} = req.body
    let productos = await Producto.find({creador: req.usuario.id}).select("-__v")
    
    productos.map(producto => {
        let { precio_venta, valor_dolar_compra, precio_compra_peso} = producto;
        if(valor_dolar_compra>0 && precio_venta> 0) {
            let res1 = precio_venta / valor_dolar_compra
            let res2 = (res1 * precio).toFixed(2)
            producto.precio_venta_conocidos = res2
            producto.precio_venta_efectivo = ((producto.precio_venta_conocidos * 105) / 100).toFixed(2)
            producto.precio_venta_tarjeta = ((producto.precio_venta_conocidos * 109) / 100).toFixed(2)
        }
        if(precio_compra_peso>0 && precio_venta>0) {
            let res1 = precio_venta / valor_dolar_compra
            let res2 = (res1 * precio).toFixed(2)
            producto.precio_venta_conocidos = res2
            producto.precio_venta_efectivo = ((producto.precio_venta_conocidos * 105) / 100).toFixed(2)
            producto.precio_venta_tarjeta = ((producto.precio_venta_conocidos * 109) / 100).toFixed(2)
        }
    })
    await Producto.updateMany({creador: req.usuario.id}).select("-__v")
    res.json({productos})
}

exports.eliminarProducto = async (req, res) => {
    try {
        let producto = await Producto.findById(req.params.id)

        if(producto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: "No autorizado"})
        }
        if(!producto) {
            return res.status(404).json({msg: "Producto no encontrado"})
        }

        await Producto.findOneAndRemove({_id: req.params.id})
        res.json({msg: "Producto eliminado"})
    } catch (error) {
        console.log(error)
    }
}

exports.eliminarTodos = async (req, res) => {
    try {
        let productos = await Producto.find({creador: req.usuario.id})
        
        if(productos.length == 0) {
            return res.json({msg: "No se encontraron productos a eliminar"})
        }

        await Producto.deleteMany({creador: req.usuario.id})
        res.json({msg: "Todos los productos se eliminaron"})
    } catch (error) {
        console.log(error)
    }
}

