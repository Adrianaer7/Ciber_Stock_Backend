import mongoose from "mongoose";

const ventaSchema = mongoose.Schema({
  codigo: {
    type: Number
  },
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  marca: {
    type: String,
    uppercase: true,
    trim: true,
  },
  modelo: {
    type: String,
    uppercase: true,
    trim: true,
  },
  barras: {
    type: String,
    uppercase: true,
    trim: true,
  },
  dolar: {
    type: Number
  },
  precioEnDolar: {
    type: Number
  },
  precioEnArs: {
    type: Number
  },
  unidades: {
    type: Number,
  },
  fecha: {
    type: String
  },
  descripcion: {
    type: String,
    uppercase: true,
    trim: true,
  },
  idProducto: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Producto", 
  },
  existeProducto: { //por si el producto se eliminó
    type: Boolean,
    default: true
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario", 
  },
  creado: {
    type: Date,
    default: Date
  }
});

const Venta = mongoose.model("Venta", ventaSchema);
export default Venta;
