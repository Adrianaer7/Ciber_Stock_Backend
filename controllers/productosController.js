const mongoose = require("mongoose")
const Producto = require("../models/Producto")
const Porcentaje = require("../models/Porcentaje")
const Venta = require("../models/Venta")
const {validationResult} = require("express-validator")
const fs = require("fs")
const path = require('path');

exports.crearProducto = async (req, res) => {
    //Revisar si hay errores
    const errores = validationResult(req)   
    if(!errores.isEmpty()) {  
        return res.status(400).json({errores: errores.array()}) 
    }
    try {
        const { codigo, nombre, marca, modelo, barras, proveedor, notas } = req.body;
        
        const producto = new Producto(req.body);
        producto.creador = req.usuario.id;
        producto.todos_proveedores = proveedor.trim() || [] //si no envio un proveedor lo dejo vacio
        
        
        if(producto.disponibles <= producto.limiteFaltante && producto.añadirFaltante) { //si el stock es menor o igual que el numero de alerta que le puse y el botón de alerta esta activado, lo pongo como faltante. Si no pongo la condicion de añadirFaltante, el stock puede ser 0 y limite 0 y me lo va a agregar automaticamente a faltante
            producto.faltante = true
        }
        producto.descripcion = (codigo  + nombre + marca + modelo  + barras + notas).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios     
        
        await producto.save()
        res.json({producto})
        
    } catch (error) {
        console.log(error)
    }
}

exports.todosProductos = async (req, res) => {
    try {
        const productos = await Producto.find({creador: req.usuario.id}).sort({creado: "desc"})
        res.json({productos})
    } catch (error) {
        console.log(error)
    }
}

exports.elProducto = async (req, res) => {
    const {id} = req.params

    const urlValida = mongoose.Types.ObjectId.isValid(id)   //comprueba que la url es de tipo objectId
    if (!urlValida) {
        return res.json({redireccionar: true}) //creo una variable y le asigno true si la id que me llega no es correcta
    }

    try {
        const producto = await Producto.findById(id)
        if(!producto) {
            return res.json({redireccionar: true})
        }
        
        res.json({producto})
    } catch (error) {
        console.log(error)
    }
}

exports.editarProducto = async (req, res) => {
    const {id} = req.params

   try {
       const {codigo, nombre, marca, modelo, barras, proveedor, notas, imagen} = req.body.producto
       let producto = await Producto.findById(id)

       if(producto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg: "No autorizado"}) 
       }
       if(!producto) { 
           return res.status(404).json({msg: "El producto no existe"})
       }

        const nuevoProducto = req.body.producto

        nuevoProducto.descripcion = (codigo + nombre + marca + modelo + barras + notas).replace(/\s\s+/g, ' ').replace(/\s+/g, '')   //el primer replace quita 2 o mas espacio entre palabra y palabra y el ultimo quita los espacios

        //listado proveedores
        if(proveedor && req.body.desdeForm) {
            if(!nuevoProducto.todos_proveedores.length) {   //si no hay ningun proveedor
                nuevoProducto.todos_proveedores = proveedor
            } else {
                let proveedorIgual = nuevoProducto.todos_proveedores.find(provider => provider === proveedor)
                if(!proveedorIgual) {  //si existen proveedores, pero ninguno igual
                    nuevoProducto.todos_proveedores.push(proveedor)
                }
            }
        }
    
        //faltante
       if(nuevoProducto.disponibles <= nuevoProducto.limiteFaltante && nuevoProducto.añadirFaltante) {
            nuevoProducto.faltante = true
        } else {
            nuevoProducto.faltante = false
        }

        //Eliminar la imagen del fontend
        if(producto.imagen !== imagen) {    //si seleccioné una nueva imagen
            if(producto.imagen) {
                const {imagen} = producto
                const ruta = path.parse(__dirname);
                const rutaModificada = (ruta.dir.replace("servidor", "cliente/public/imagenes"))
                fs.unlinkSync(rutaModificada + `/${imagen}`) //unlink es una funcion que permite eliminar un archivo del SO.
            }
        }

       producto = await Producto.findByIdAndUpdate({_id: id}, nuevoProducto, {new: true})
       res.json({producto})
   } catch (error) {
       console.log(error)
   }
}

exports.editarProductos = async (req, res) => {
    const {precio} = req.body

    try {
        let productos = await Producto.find({creador: req.usuario.id}).select("-__v").sort({creado: "desc"})
        let porcentajeEfectivo = await Porcentaje.findOne({tipo: "EFECTIVO"})
        let porcentajeTarjeta = await Porcentaje.findOne({tipo: "TARJETA"})
        let porcentajeAhoraDoce = await Porcentaje.findOne({tipo: "AHORADOCE"})
    
        //modifico los productos a medida que se van recorriendo
        const productoCambiado = async (producto) => {
            await Producto.findByIdAndUpdate({_id: producto._id}, producto , {new: true} )
        }

        productos.forEach(producto => {
            let {precio_venta, valor_dolar_compra, precio_compra_peso} = producto;
            
            //en caso de que modifique el precio a 0, se reinician estos valores
            if(!precio_venta) {
                producto.precio_venta_ahoraDoce = 0
                producto.precio_venta_cuotas = 0

                productoCambiado(producto)
            }

            //comprado a valor dolar
            if(precio_venta>0 && valor_dolar_compra> 0) {
                let res1 = precio_venta / valor_dolar_compra
                let res2 = (res1 * precio).toFixed(2)
                producto.precio_venta_conocidos = res2
                producto.precio_venta_efectivo = ((res2 * (100 + porcentajeEfectivo.comision)) / 100).toFixed(2)
                producto.precio_venta_tarjeta = ((res2 * (100 + porcentajeTarjeta.comision)) / 100).toFixed(2)
                producto.precio_venta_ahoraDoce = (((producto.precio_venta_tarjeta) * ((porcentajeAhoraDoce.comision) + 100)) / 100).toFixed(2)
                producto.precio_venta_cuotas = (producto.precio_venta_ahoraDoce / 12).toFixed(2)
                
                productoCambiado(producto)
            }

            //comprado en pesos
            if(precio_venta>0 && precio_compra_peso>0) {
                let res1 = precio_venta / valor_dolar_compra
                let res2 = (res1 * precio).toFixed(2)
                producto.precio_venta_conocidos = res2
                producto.precio_venta_efectivo = ((res2 * (100 + porcentajeEfectivo.comision)) / 100).toFixed(2)
                producto.precio_venta_tarjeta = ((res2 * (100 + porcentajeTarjeta.comision)) / 100).toFixed(2)
                producto.precio_venta_ahoraDoce = (((producto.precio_venta_tarjeta) * ((porcentajeAhoraDoce.comision) + 100)) / 100).toFixed(2)
                producto.precio_venta_cuotas = (producto.precio_venta_ahoraDoce / 12).toFixed(2)

                productoCambiado(producto)
            }
        })
        res.json()  //devuelvo si o si un json
    } catch (error) {
        console.log(error)
    }
}

exports.eliminarProducto = async (req, res) => {
    const {id} = req.params

    try {
        let producto = await Producto.findById(id)

        if(producto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: "No autorizado"})
        }
        if(!producto) {
            return res.status(404).json({msg: "Producto no encontrado"})
        }

        //para que al mostrar las ventas, no muestre opcion de eliminar o editar la venta
        const venta = await Venta.findOne({idProducto: id})
        if(venta) {
            let ventaEditada = venta
            ventaEditada.existeProducto = false
            await Venta.findOneAndUpdate({idProducto: id}, ventaEditada, {new: true})
        }

        //Eliminar la imagen del fontend
        const {imagen} = producto
        if(imagen) {
            const ruta = path.parse(__dirname);
            const rutaModificada = (ruta.dir.replace("servidor", "cliente/public/imagenes"))
            
            fs.unlinkSync(rutaModificada + `/${imagen}`) //unlink es una funcion que permite eliminar un archivo del SO.
        }

        //eliminar el producto
        await Producto.findOneAndRemove({_id: id})
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


