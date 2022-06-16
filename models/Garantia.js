const mongoose = require("mongoose")

const GarantiaSchema = mongoose.Schema({
  idProducto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto"
  },
  codigo: {
    type: Number,
    trim: true,
    required: true,
  },
  detalles : {
    type: Array,
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

module.exports = mongoose.model("Garantia", GarantiaSchema)