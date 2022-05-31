const Producto = require("../models/Producto")
const Compra = require("../models/Compra")
require("dotenv").config({path: 'variables.env'})  //dotenv carga variables de entorno que hay en un archivo .env. El path es la ruta del archivo
const pdf = require("html-pdf")
const fs = require("fs")
const {generarFecha} = require("../helpers/generarId")


exports.generarPDF = async(req,res, next) => {

    const productos = await Producto.find({creador: req.usuario.id})
    const compras = await Compra.find({creador: req.usuario.id})

    const listado = productos.map(producto => 
        `<li><span>Nombre: </span>${producto.nombre}</li>
         <li><span>Codigo: </span>${producto.codigo}</li>
         <li><span>Marca: </span>${producto.marca}</li>
         <li><span>Modelo: </span>${producto.modelo}</li>
         <li><span>Codigo de barras:</span> ${producto.barras}</li>
         <li><span>Rubro: </span> ${producto.rubro}</li>
         <li><span>Precio de venta a conocidos: </span>$${producto.precio_venta_conocidos  > 0 ? producto.precio_venta_conocidos : 0}</li>
         <li><span>Precio de venta en efectivo: </span>$${producto.precio_venta_efectivo  > 0 ? producto.precio_venta_efectivo : 0}</li>
         <li><span>Precio de venta con tarjeta: </span>$${producto.precio_venta_tarjeta  > 0 ? producto.precio_venta_tarjeta : 0}</li>
         <li><span>Precio de compra en dolares: </span>$${producto.precio_compra_dolar > 0 ? producto.precio_compra_dolar : 0}</li>
         <li><span>Precio de compra en pesos: </span>$${producto.precio_compra_peso > 0 ? producto.precio_compra_peso : 0}</li>
         <li><span>Valor del dolar en la compra: </span>$${producto.valor_dolar_compra > 0 ? producto.valor_dolar_compra: 0}</li>
         <li><span>Ultimo proveedor: </span>${producto.proveedor}</li>
         <li><span>Proveedores: </span>${producto.todos_proveedores.map(proveedores => proveedores)}</li>
         <li><span>Fecha de las compras: </span>${compras.map(compra => compra.codigo === producto.codigo && compra.historial.map(historia => generarFecha(historia.fecha_compra)))}</li>
         <li><span>Fecha de la ultima compra: </span>${producto.fecha_compra}</li>
         <li><span>Disponibles: </span>${producto.disponibles > 0 ? producto.disponibles : 0}</li>
         <li><span>Rentabilidad: </span>${producto.rentabilidad > 0 ? producto.rentabilidad : 0}%</li>
         <li><span>Notas: </span>${producto.notas}</li>
        `)

    const content = `
<!doctype html>
    <html>
       <head>
            <meta charset="utf-8">
            <title>PDF Result Template</title>
            <style>
                body {
                    font-family: Helvetica;
                    font-size: 1rem;
                    padding: 0rem 3rem;
                }
                h1 {
                    color: red;
                    text-align: center;
                }
                ul {
                    margin-left: 0px;
                    list-style: none;
                    padding: 5px;
                }
                li {
                    background-color: lightgray;
                    padding: 5px;
                }
                ul li span {
                    font-weight: 700;
                    text-transform: uppercase;
                }
            </style>
        </head>
        <body>
            <div id="pageHeader" style="border-bottom: 1px solid #ddd; ">
                <p>Listado de productos</p>
            </div>
            <div id="pageFooter" style="border-top: 1px solid #ddd; ">
                <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p>
            </div>
            
            <ul>${listado}</ul>
        </body>
    </html>
`;
    pdf.create(content).toFile('./Listado de productos.pdf', function(err, res, req) {
        if (err){
            console.log(err);
        }
        next()
    });
}