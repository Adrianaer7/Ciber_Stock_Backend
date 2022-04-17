const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const proveedorSchema = new Schema({
  nombre: {
    type: String,
    uppercase: true,
    trim: true,
  },
  creador: {
    type: mongoose.Schema.Types.ObjectId, //es el id del usuario que le paso en el ProductoController
    ref: "Usuario", //Tiene que tener el mismo nombre que el module.exports de abajo del modelo que le queremos pasar. De esta forma va a saber qué le estoy pasando
  },
});

module.exports = mongoose.model("Proveedores", proveedorSchema);
