const mongoose = require("mongoose");

const DolaresSchema = mongoose.Schema({
  precio: {
    type: Number
  },
  automatico: {
    type: Boolean
  }
});

module.exports = mongoose.model("Dolar", DolaresSchema);
