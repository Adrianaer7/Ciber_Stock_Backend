import Producto from "../models/Producto.js"

export const todosCodigos = async(req,res) => {
    try {
        const productos = await Producto.find({creador: req.usuario.id})
        const codigos = productos.map(producto => producto.codigo)
        let listado = []
        for (let i = 1; i < 1000; i++) {
            listado.push(i)
        }
            
        const codigosDisponibles = listado.filter(lista => !codigos.includes(lista))
        res.json({codigosDisponibles})
    } catch (error) {
        console.log(error)
    }
}