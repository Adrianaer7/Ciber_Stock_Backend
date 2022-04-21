const mongoose = require("mongoose")

const ProductoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true, //elimina los espacios en blanco
    uppercase: true,
  },
  marca: {
    type: String,
    trim: true,
    uppercase: true,
  },
  modelo: {
    type: String,
    trim: true,
    uppercase: true,
  },
  codigo: {
    type: Number,
    trim: true,
    required: true,
  },
  barras: {
    type: Number,
    trim: true
  },
  rubro: {
    type: String,
    uppercase: true,
    trim: true,
  },
  precio_venta: {
    type: Number,
    trim: true,
  },
  precio_venta_conocidos: {
    type: Number,
  },
  precio_venta_efectivo: {
    type: Number,
  },
  precio_venta_tarjeta: {
    type: Number,
  },
  precio_compra_dolar: {
    type: Number,
  },
  precio_compra_peso: {
    type: Number,
  },
  valor_dolar_compra: {
    type: Number,
    trim: true,
    required: true,
  },
  valor_dolar_hoy: {
    type: Number,
  },
  proveedor: {
    type: String,
    trim: true,
    uppercase: true,
  },
  fecha_compra: {
    type: String,
  },
  disponibles: {
    type: Number,
  },
  rentabilidad: {
    type: Number,
  },
  notas: {
    type: String,
  },
  faltante: {
    type: Boolean,
  },
  limiteFaltante: {
    type: Number,
  },
  añadirFaltante: {
    type: Boolean,
  },
  descripcion: {
    type: String,
    uppercase: true,
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, //es el id del usuario que le paso en el ProductoController
    ref: "Usuario", //Tiene que tener el mismo nombre que el module.exports de abajo del modelo que le queremos pasar. De esta forma va a saber qué le estoy pasando
  },
  creado: {
    type: Date,
    default: Date,
  },
});

module.exports = mongoose.model("Producto", ProductoSchema)