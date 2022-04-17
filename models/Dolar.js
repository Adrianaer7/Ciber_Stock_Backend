const mongoose = require("mongoose");

const DolaresSchema = mongoose.Schema({
  precio: {
    type: Number
  }
});

module.exports = mongoose.model("Dolar", DolaresSchema);
