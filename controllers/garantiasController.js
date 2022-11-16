const Garantia = require("../models/Garantia")
const Producto = require("../models/Producto")


exports.crearGarantia = async(req,res) => {
    try {
        const {garantia, proveedor, codigo} = req.body

        const {id} = await Producto.findOne({codigo})
        const laGarantia = await Garantia.findOne({idProducto: id})

        //nueva garantia
        if(!laGarantia) {
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
        if(laGarantia) {
            let garantiaPasada = laGarantia
            const {detalles} = garantiaPasada
            const indice = detalles.map(detalle => detalle.proveedor).indexOf(proveedor)    //si el proveedor que traigo del body es el mismo que está en el detalle, devuelvo su posicion en el array de detalles, sino devuelvo -1
            let detalle = {
                caducidad: garantia, 
                proveedor
            }
            
            //si no existe el proveedor, creo una nueva garantia
            if(indice < 0) {
                garantiaPasada.detalles.push(detalle)
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
    } catch (error) {
        console.log(error)
    }
}

exports.traerGarantias = async(req,res) => {
    try {
        const garantias = await Garantia.find({creador: req.usuario.id}) 
        res.json({garantias})
    } catch (error) {
        console.log(error)
    }
}