const mongoose = require("mongoose")

const CompraSchema = mongoose.Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto"
  },
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
  cantidad: {
    type: Array,
  },
  precio_compra_dolar: {
    type: Array,
  },
  valor_dolar_compra: {
    type: Array,
  },
  proveedor: {
    type: Array,
    uppercase: true,
  },
  fecha_compra: {
    type: Array,
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

module.exports = mongoose.model("Compra", CompraSchema)