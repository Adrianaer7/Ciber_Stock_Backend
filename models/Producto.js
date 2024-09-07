import mongoose from "mongoose";

const ProductoSchema = mongoose.Schema({
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
  barras: {
    type: String,
    trim: true
  },
  rubro: {
    type: String,
    uppercase: true,
    trim: true,
  },
  rubroValor: {
    type: Number
  },
  precio_venta: {
    type: Number
  },
  precio_venta_conocidos: {
    type: Number
  },
  precio_venta_efectivo: {
    type: Number
  },
  precio_venta_tarjeta: {
    type: Number
  },
  precio_venta_ahoraDoce: {
    type: Number
  },
  precio_venta_cuotas: {
    type: Number
  },
  precio_compra_dolar: {
    type: Number
  },
  precio_compra_peso: {
    type: Number
  },
  valor_dolar_compra: {
    type: Number,
    trim: true,
  },
  valor_dolar_hoy: {
    type: Number
  },
  proveedor: {
    type: String,
    trim: true,
  },
  todos_proveedores: {
    type: Array
  },
  factura: {
    type: String,
    trim: true
  },
  garantia: {
    type: String
  },
  fecha_compra: {
    type: String
  },
  disponibles: {
    type: Number
  },
  imagen: {
    type: String
  },
  notas: {
    type: String
  },
  faltante: {
    type: Boolean
  },
  limiteFaltante: {
    type: Number
  },
  añadirFaltante: {
    type: Boolean
  },
  visibilidad: {
    type: Boolean
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

const Producto = mongoose.model("Producto", ProductoSchema);
export default Producto;
