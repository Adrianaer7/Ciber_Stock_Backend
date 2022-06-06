const Compra = require("../models/Compra")
const Producto = require("../models/Producto")
require("dotenv").config({path: 'variables.env'})


exports.crearCompra = async (req, res) => {
    try {
        const {nombre, marca, modelo, codigo, precio_compra_dolar, valor_dolar_compra, proveedor, fecha_compra} = req.body.producto
        const productos = await Producto.find({codigo}) //busco un producto que coincida con el codigo que recibo al añadir stock
        const id = productos[0]._id //guardo su id
        const producto = await Compra.find({idProducto: id})    //busco en todas las compras si hay alguna compra que coincida con el id del producto de la lista de productos

        if(!producto && req.body.cantidad || producto.length == 0 && req.body.cantidad ) { //si a ese producto nunca se le hizo una compra y traigo una cantidad, agrego el producto entero
            const laCompra = {  //creo el objeto a agregar con lo que me llega
                nombre, 
                marca, 
                modelo, 
                codigo,
                historial: {cantidad: req.body.cantidad, fecha_compra, precio_compra_dolar, valor_dolar_compra, proveedor},
                idProducto: id,
                creador: req.usuario.id,
                creado: Date.now()
            }
            const compra = new Compra(laCompra)
            await compra.save()
            res.json({compra})
        } 
        if (producto.length > 0 && req.body.cantidad ) {    //si existe el producto en el listado de compras y la cantidad es mayora a 0, edito el producto entero
            const compraPasada = producto[0] //guardo el primer y unico objeto coincidente
            const objeto = {cantidad: req.body.cantidad, fecha_compra, precio_compra_dolar, valor_dolar_compra, proveedor}
            compraPasada.nombre = nombre
            compraPasada.marca = marca
            compraPasada.modelo = modelo
            compraPasada.historial = [...compraPasada.historial, objeto ]
            compraPasada.creado = Date.now()
            const compra = new Compra(compraPasada)
            await compra.save()
            res.json({compra})
        }
        if(producto && !req.body.cantidad ) {   //si el producto existe en el listado de compras y no existe cantidad, es porque se modifico algun otro campo del objeto, entonces guardo solo lo modificado
            if(producto[0] !== undefined) { //me trae unedefined en la primera posicion nose porque
                const compraPasada = producto[0]
                compraPasada.nombre = nombre
                compraPasada.marca = marca
                compraPasada.modelo = modelo
                const compra = new Compra(compraPasada)
                await compra.save()
            }
        }
    } catch (error) {
        console.log(error)
    }
}



exports.traerCompras = async (req, res) => {
    try {
        const todasCompras = await Compra.find({creador: req.usuario.id}).sort({creado: "desc"})
        const todas = todasCompras.map(compras => compras.historial.sort((a,b) => a.fecha_compra > b.fecha_compra ? 1 : -1) && compras )
        res.json({todas})
    } catch (error) {
        console.log(error)
    }
}
