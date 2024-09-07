import mongoose from "mongoose";

const DolaresSchema = mongoose.Schema({
  precio: {
    type: Number
  },
  automatico: {
    type: Boolean
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
});

const Dolares = mongoose.model("Dolares", DolaresSchema);
export default Dolares;

