const jwt = require("jsonwebtoken")

//genero JWT
module.exports = generarJWT = (id) => {
  return jwt.sign({id}, process.env.SECRETA, {expiresIn: "30d"})
};
