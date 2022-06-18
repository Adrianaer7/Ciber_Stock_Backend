const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const proveedorSchema = new Schema({
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  telPersonal: {
    type: String,
    trim: true
  },
  telEmpresa: {
    type: String,
    trim: true
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Proveedores", proveedorSchema);
