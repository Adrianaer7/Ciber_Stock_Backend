const Compra = require("../models/Compra")
const Producto = require("../models/Producto")
require("dotenv").config({path: 'variables.env'})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo


exports.crearCompra = async (req, res) => {
    try {
        const {nombre, marca, modelo, codigo, barras, precio_compra_dolar, valor_dolar_compra, proveedor, fecha_compra} = req.body.producto
        const productos = await Producto.find({codigo})
        if(productos.length > 0) {
            const id = productos[0]._id
            const prod = await Compra.find({idProducto: id})
            if(prod.length == 0 || !prod) {
                const laCompra = {
                    nombre, marca, modelo, codigo, barras, precio_compra_dolar, valor_dolar_compra, proveedor, fecha_compra
                }
                const compra = new Compra(laCompra)
                compra.cantidad = [parseInt(req.body.cantidad)]
                compra.idProducto = id
                compra.creador = req.usuario.id
                await compra.save()
                res.json({compra})
            } else {
                console.log("else")
                const array1 = prod[prod.length -1]
                array1.cantidad.push(req.body.cantidad)
                console.log(array1)
                const compra = new Compra(array1)
                await compra.save()
                res.json({compra})
                console.log(compra)
            }
        } 
    } catch (error) {
        console.log(error)
    }
}

exports.traerCompras = async (req, res) => {
    try {
        const compras = await Compra.find({creador: req.usuario.id})
        res.json({compras})
    } catch (error) {
        console.log(error)
    }
}