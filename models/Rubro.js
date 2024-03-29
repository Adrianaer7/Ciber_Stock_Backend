const mongoose = require("mongoose");


const rubroSchema = mongoose.Schema({
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  rentabilidad: {
    type: Number
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
  },
});

module.exports = mongoose.model("Rubro", rubroSchema);
