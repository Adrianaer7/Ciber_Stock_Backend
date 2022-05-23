const Compra = require("../models/Compra")
const Producto = require("../models/Producto")
require("dotenv").config({path: 'variables.env'})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo


exports.crearCompra = async (req, res, next) => {
    try {
        const {nombre, marca, modelo, codigo, precio_compra_dolar, valor_dolar_compra, proveedor, fecha_compra} = req.body.producto
        const productos = await Producto.find({codigo}) //busco un producto que coincida con el codigo que recibo al añadir stock
        const id = productos[0]._id //guardo su id
        const producto = await Compra.find({idProducto: id})    //busco en todas las compras si hay alguna compra que coincida con el id del producto de la lista de productos
        if(producto.length == 0 || !producto) { //si a ese producto nunca se le hizo una compra, lo añado
            const laCompra = {  //creo el objeto a agregar con lo que me llega
                nombre, marca, modelo, codigo, precio_compra_dolar, valor_dolar_compra
            }
            const compra = new Compra(laCompra)
            compra.cantidad = parseInt(req.body.cantidad)   //a la cantidad le agrego un array que comienza con lo que me llega del body
            compra.cantidad.reverse()
            compra.valor_dolar_compra = parseInt(valor_dolar_compra)
            compra.valor_dolar_compra.reverse()
            compra.precio_compra_dolar.reverse()
            compra.proveedor = [proveedor]
            compra.proveedor.reverse()
            compra.fecha_compra = fecha_compra
            compra.fecha_compra.reverse()
            compra.idProducto = id  //le doy clave foranea del producto
            compra.creador = req.usuario.id
            compra.creado = Date.now()
            if(precio_compra_dolar) {
                compra.precio_compra_dolar = parseInt(precio_compra_dolar)
            } else {
                compra.precio_compra_dolar = ""
            }
            await compra.save()
            res.json({compra})
        } else {
            const compraPasada = producto[0] //guardo el primer y unico objeto coincidente
            compraPasada.nombre = nombre
            compraPasada.marca = marca
            compraPasada.modelo = modelo
            compraPasada.cantidad.push(Number(req.body.cantidad)) //al array de cantidad le agrego la cantidad del body
            compraPasada.cantidad.reverse()
            compraPasada.valor_dolar_compra.push(valor_dolar_compra)
            compraPasada.valor_dolar_compra.reverse()
            compraPasada.precio_compra_dolar.push(precio_compra_dolar)
            compraPasada.precio_compra_dolar.reverse()
            compraPasada.fecha_compra.push(fecha_compra)
            compraPasada.fecha_compra.reverse()
            compraPasada.creado = Date.now()
            compraPasada.proveedor.push(proveedor)
            compraPasada.proveedor.reverse()
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
        const compras = await Compra.find({creador: req.usuario.id}).sort({creado: "desc"})
        res.json({compras})
    } catch (error) {
        console.log(error)
    }
}
