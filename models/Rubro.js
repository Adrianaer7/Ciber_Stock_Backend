import mongoose from "mongoose";

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

const Rubro = mongoose.model("Rubro", rubroSchema);
export default Rubro;

