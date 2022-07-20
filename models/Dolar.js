const mongoose = require("mongoose");

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

module.exports = mongoose.model("Dolar", DolaresSchema);
