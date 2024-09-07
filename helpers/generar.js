import jwt from "jsonwebtoken"

//genero JWT
const generarJWT = (id) => {
  return jwt.sign({id}, process.env.SECRETA, {expiresIn: "30d"})
};

//genero fecha formateada
const generarFecha = fecha => { //tomo la fecha del producto
  if(fecha) {
    const fechaNueva = new Date(fecha+"T00:00:00")  //le agrego T00:00:00 para que no haga conflicto la zona horaria y agende mal el dia de la fecha
    const opciones = {year: "numeric", month: "numeric", day: "2-digit"}
    return fechaNueva.toLocaleString("es-AR", opciones)
  }
}

//genero id
const generarId = () => {
  const random = Math.random().toString(32).substring(2);
  const fecha = Date.now().toString(32);
  return random + fecha;
};

export {
  generarFecha,
  generarId,
  generarJWT
}