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
        const { codigo, nombre, marca, modelo, barras, cantidad } = req.body;
        const products = await Producto.find({ creador: req.usuario.id });  //obtengo solo los productos del usuario que esta logeado
        let boolean = products.map((producto) =>   //recorro los productos y consulto si existe un producto con el mismo codigo, devuelvo un array con false o true si coincide
          producto.codigo === parseInt(codigo) ? true : false
        )
        const code = boolean.includes(true)    //consulta si hay algun true en el array
        if(code) {  //si hay coincidencias, devuelvo msj, sino, creo el producto
            return res.status(400).json({msg: "Ya existe este codigo"})
        } 

        const elProducto = {
            nombre : req.body.nombre,
            marca : req.body.marca,
            modelo : req.body.modelo,
            codigo : req.body.codigo,
            barras : req.body.barras,
            rubro : req.body.rubro,
            precio_venta : req.body.precio_venta,
            precio_compra_dolar : req.body.precio_compra_dolar,
            precio_compra_peso : req.body.precio_compra_peso,
            valor_dolar_compra : req.body.valor_dolar_compra,
            proveedor : req.body.proveedor,
            fecha_compra : req.body.fecha_compra,
            rentabilidad : req.body.rentabilidad,
            notas : req.body.notas,
            faltante : req.body.faltante,
            limiteFaltante : req.body.limiteFaltante,
            añadirFaltante : req.body.añadirFaltante,
        }

        const producto = new Producto(elProducto);
        producto.disponibles = cantidad
        console.log(producto)
        producto.creador = req.usuario.id;
        producto.precio_venta_tarjeta = 0
        producto.precio_venta_efectivo = 0
        
        if(!producto.precio_venta) {    //para que al mostrar la lista, pueda ordenar los productos segun precio. Si el precio está como null no lo puedo ordenar.
            producto.precio_venta_conocidos = 0
        }
        if(producto.disponibles <= producto.limiteFaltante && producto.añadirFaltante) { //si el stock es menor o igual que el numero de alerta que le puse y el botón de alerta esta activado, lo pongo como faltante. Si no pongo la condicion de añadirFaltante, el stock puede ser 0 y limite 0 y me lo va a agregar automaticamente a faltante
            producto.faltante = true
        }
        producto.descripcion = (codigo + " " + nombre + " " + marca + " " + modelo).trim().replace(/\s\s+/g, ' ')

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
       const {_id, nombre, marca, modelo, codigo, barras, rubro, precio_venta, precio_compra_dolar, precio_compra_peso, valor_dolar_compra, proveedor, fecha_compra, cantidad, disponibles, rentabilidad, notas, faltante, limiteFaltante, añadirFaltante, creado, creador, precio_venta_tarjeta, precio_venta_efectivo, precio_venta_conocidos, descripcion} = req.body
       
       let producto = await Producto.findById(req.params.id)

       if(producto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: "No autorizado"})
       }
       if(!producto) { 
           return res.status(404).json({msg: "El producto no existe"})
       }

       const nuevoProducto = {}
       nuevoProducto._id = _id
       nuevoProducto.nombre = nombre
       nuevoProducto.marca = marca
       nuevoProducto.modelo = modelo
       nuevoProducto.codigo = codigo
       nuevoProducto.barras = barras
       nuevoProducto.rubro = rubro
       nuevoProducto.precio_venta = precio_venta
       nuevoProducto.precio_compra_dolar = precio_compra_dolar
       nuevoProducto.precio_compra_peso = precio_compra_peso
       nuevoProducto.valor_dolar_compra = valor_dolar_compra
       nuevoProducto.proveedor = proveedor
       nuevoProducto.fecha_compra = fecha_compra
       nuevoProducto.disponibles = disponibles + cantidad
       nuevoProducto.rentabilidad = rentabilidad
       nuevoProducto.notas = notas
       nuevoProducto.faltante = faltante
       nuevoProducto.limiteFaltante = limiteFaltante
       nuevoProducto.añadirFaltante = añadirFaltante
       nuevoProducto.creado = creado
       nuevoProducto.creador = creador
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

