//genero id
module.exports =  generarId = () => {
  const random = Math.random().toString(36).substring(2);
  const fecha = Date.now().toString(36);
  return random + fecha;
};

//genero fecha formateada
module.exports = generarFecha = fecha => { //tomo la fecha del producto
  if(fecha) {
    
    const fechaNueva = new Date(fecha+"T00:00:00")  //le agrego T00:00:00 para que no haga conflicto la zona horaria y agende mal el dia de la fecha
    const opciones = {year: "numeric", month: "numeric", day: "2-digit"}
    return fechaNueva.toLocaleString("es-AR", opciones)
  }
}