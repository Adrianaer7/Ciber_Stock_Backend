const mongoose = require("mongoose")

const CompraSchema = mongoose.Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto"
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
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
  historial: {
    type: Array,
  },


  descripcion: {
    type: String,
    uppercase: true,
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  creado: {
    type: Date,
    default: Date,
  },
});

module.exports = mongoose.model("Compra", CompraSchema)