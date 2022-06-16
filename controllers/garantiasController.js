const Garantia = require("../models/Garantia")
const Producto = require("../models/Producto")


exports.crearGarantia = async(req,res) => {
    const {garantia, proveedor, codigo} = req.body
    const productos = await Producto.find({codigo})
    const id = productos[0]._id
    const producto = await Garantia.find({idProducto: id})
    //nueva garantia
    if(!producto || producto.length == 0) {
        const nuevaGarantia = {
            idProducto: id,
            codigo,
            detalles: {caducidad: garantia, proveedor},
            creador: req.usuario.id
        }
        const garantiaNueva = new Garantia(nuevaGarantia)
        await garantiaNueva.save()
        res.json({garantiaNueva})
    }
    //si existe un producto con una garantia creada
    if(producto.length > 0) {
        let garantiaPasada = producto[0]
        const {detalles} = garantiaPasada
        const indice = detalles.map(detalle => detalle.proveedor).indexOf(proveedor)
        let detalle = {caducidad: garantia, proveedor}
        //si no existe el proveedor, creo una nueva garantia
        if(indice < 0) {
            garantiaPasada.detalles = [...garantiaPasada.detalles, detalle]
            const nuevaGarantia = new Garantia(garantiaPasada)
            await nuevaGarantia.save()
            res.json({garantiaPasada})
        } else {
            //si existe, solo lo reemplazo con lo nuevo del body
            garantiaPasada.detalles[indice] = detalle
            const nuevaGarantia = new Garantia(garantiaPasada)
            await nuevaGarantia.save()
            res.json({garantiaPasada})
        }
    }
}

exports.traerGarantias = async(req,res) => {
    const garantias = await Garantia.find({creador: req.usuario.id})
    res.json({garantias})
}