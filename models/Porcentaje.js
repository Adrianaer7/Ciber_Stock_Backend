const mongoose = require("mongoose");


const porcentajeSchema = mongoose.Schema({
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  comision: {
    type: Number
  },
  tipo: {
    type: String
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
  },
});

module.exports = mongoose.model("Porcentaje", porcentajeSchema);
