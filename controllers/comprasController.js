import Compra from "../models/Compra.js"
import Producto from "../models/Producto.js"


export const crearCompra = async (req, res) => {
    try {
        const {nombre, marca, modelo, codigo, precio_compra_dolar, precio_compra_peso, valor_dolar_compra, proveedor, garantia, factura, barras, fecha_compra, notas} = req.body.producto
        const {id} = await Producto.findOne({codigo}) //busco un producto que coincida con el codigo que recibo al añadir stock y extraigo el id
        
        const producto = await Compra.findOne({idProducto: id})    //busco en todas las compras si hay alguna compra que coincida con el id del producto de la lista de productos

        let arsAdolar
        if(precio_compra_peso > 0) {
            arsAdolar = (precio_compra_peso / valor_dolar_compra ).toFixed(2)
        }

        if(!producto && req.body.cantidad) { //si a ese producto nunca se le hizo una compra y traigo una cantidad, agrego el producto entero
            const laCompra = {  //creo el objeto a agregar con lo que me llega
                nombre, 
                marca, 
                modelo, 
                codigo,
                historial: {cantidad: req.body.cantidad, fecha_compra, precio_compra_dolar, arsAdolar, valor_dolar_compra, proveedor, barras, factura, garantia},
                idProducto: id,
                descripcion: (nombre + marca + modelo  + barras + factura + notas).replace(/\s\s+/g, ' ').replace(/\s+/g, ''),
                creador: req.usuario.id,
                creado: Date.now()
            }
            const compra = new Compra(laCompra)
            await compra.save()
            res.json({compra})
        } 
        if (producto && req.body.cantidad ) {    //si existe el producto en el listado de compras y la cantidad es mayora a 0, edito el producto entero
            const compraPasada = producto //guardo el primer y unico objeto coincidente
            const datos = {cantidad: req.body.cantidad, fecha_compra, precio_compra_dolar, arsAdolar, valor_dolar_compra, proveedor, barras, factura, garantia}
            compraPasada.nombre = nombre
            compraPasada.marca = marca
            compraPasada.modelo = modelo
            compraPasada.historial.push(datos)
            compraPasada.descripcion = (nombre + marca + modelo  + barras + factura + notas).replace(/\s\s+/g, ' ').replace(/\s+/g, '')
            compraPasada.creado = Date.now()

            const compra = new Compra(compraPasada)
            await compra.save()
            res.json({compra})
        }
        if(producto && !req.body.cantidad ) {   //si el producto existe en el listado de compras y no existe cantidad, es porque se modifico algun otro campo del objeto, entonces guardo solo lo modificado
            const compraPasada = producto
            compraPasada.nombre = nombre
            compraPasada.marca = marca
            compraPasada.modelo = modelo
            compraPasada.descripcion = (nombre + marca + modelo  + barras + factura + notas).replace(/\s\s+/g, ' ').replace(/\s+/g, '')
            const compra = new Compra(compraPasada)
            compra.save()
        }
    } catch (error) {
        console.log(error)
    }
}


export const traerCompras = async (req, res) => {
    try {
        const todasCompras = await Compra.find({creador: req.usuario.id}).sort({creado: "desc"})
        const todas = todasCompras.map(compras => compras.historial.sort((a,b) => a.fecha_compra > b.fecha_compra ? 1 : -1) && compras )
        res.json({todas})
    } catch (error) {
        console.log(error)
    }
}
