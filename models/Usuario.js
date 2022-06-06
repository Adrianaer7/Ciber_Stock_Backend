const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcrypt")

const usuarioSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true 
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    }
},
{   //crea 2 columnas, de actualizado y creado
    timestamps: true
});

usuarioSchema.pre("save", async function(next) {    //este codigo se va a ejecutar antes de almacenar el registro en la bd
    if(!this.isModified("password")) {
      next()  
    }
    const salt = await bcrypt.genSalt(10)   //cadena aleatoria de strings
    this.password = await bcrypt.hash(this.password, salt)  //this.password en el parametro es la contraseña en string que obtengo del body, y el salt. Con estos 2 parametros, hasheo la contraseña
})

usuarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await  bcrypt.compare(passwordFormulario, this.password)  //this.password contiene la password del usuarii, y la compara con la que viene del body. Funcion que se ejecuta en authController. Esto retorna true o false
}

module.exports = mongoose.model("Usuarios", usuarioSchema)  //Si todavia no fue creado ningun usuario, MongoDB crea automaticamente colecciones de nuestro registro. En este caso seria usuarios