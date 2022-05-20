const Compra = require("../models/Compra")
const Producto = require("../models/Producto")
require("dotenv").config({path: 'variables.env'})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo


exports.crearCompra = async (req, res) => {
    try {
        const {nombre, marca, modelo, codigo, barras, precio_compra_dolar, valor_dolar_compra, proveedor, fecha_compra} = req.body.producto
        const productos = await Producto.find({codigo}) //busco un producto que coincida con el codigo que recibo al añadir stock
        const id = productos[0]._id //guardo su id
        const producto = await Compra.find({idProducto: id})    //busco en todas las compras si hay alguna compra que coincida con el id del producto del body
        if(producto.length == 0 || !producto) { //si a ese producto nunca se le hizo una compra, lo añado
            const laCompra = {  //creo el objeto a agregar con lo que me llega
                nombre, marca, modelo, codigo, barras, precio_compra_dolar, valor_dolar_compra, proveedor
            }
            const compra = new Compra(laCompra)
            compra.cantidad = [parseInt(req.body.cantidad)]   //a la cantidad le agrego un array que comienza con lo que me llega del body
            compra.valor_dolar_compra = [parseInt(valor_dolar_compra)]
            compra.precio_compra_dolar = [parseInt(precio_compra_dolar)]
            compra.fecha_compra = [fecha_compra]
            compra.idProducto = id  //le doy clave foranea del producto
            compra.creador = req.usuario.id
            await compra.save()
            res.json({compra})
        } else {    //si ya existe un historial de compra del producto
            const compraPasada = producto[0] //guardo el primer y unico objeto coincidente
            compraPasada.nombre = nombre
            compraPasada.marca = marca
            compraPasada.modelo = modelo
            compraPasada.proveedor = proveedor
            compraPasada.cantidad.push(req.body.cantidad) //al array de cantidad le agrego la cantidad del body
            compraPasada.valor_dolar_compra.push(valor_dolar_compra)
            compraPasada.precio_compra_dolar.push(precio_compra_dolar)
            compraPasada.fecha_compra.push(fecha_compra)
            const compra = new Compra(compraPasada)
            await compra.save()
            res.json({compra})
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