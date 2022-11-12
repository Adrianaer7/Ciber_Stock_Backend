const mongoose = require("mongoose");

const proveedorSchema =  mongoose.Schema({
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  empresa: {
    type: String,
    uppercase: true,
    trim: true,
  },
  telPersonal: {
    type: String,
    uppercase: true,
    trim: true
  },
  telEmpresa: {
    type: String,
    uppercase: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  datos: {
    type: String,
    uppercase: true,
    trim: true
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Proveedores", proveedorSchema);
