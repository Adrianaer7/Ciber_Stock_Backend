const mongoose = require("mongoose");


const ventaSchema = mongoose.Schema({
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
  },
});

module.exports = mongoose.model("Venta", ventaSchema);
