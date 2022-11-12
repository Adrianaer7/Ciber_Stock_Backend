const nodemailer = require("nodemailer")

module.exports = emailOlvidePassword = async (datos) => {
  const {nombre, email, token}  = datos

  const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  });
  
  //Informacion del email
  await transport.sendMail({
    from: '"Stock - Ciber infotel" <correo@correo.com>',
    to: email,
    subject: "Stock Ciber - Reestablece tu contraseña",
    text: "Comprueba tu cuenta",
    html: ` 
      <h1>Hola, ${nombre}. Has solicitado reestablecer tu contraseña</h1>
      <p>Clickea en el siguiente enlace para cambiar tu contraseña: 
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">REESTABLECER CONTRASEÑA</a>
      </p>
      <p>Si tu no solicitaste el cambio de contraseña, ignora este mensaje.</p>
      <style>
        h1,p,a {font-family: Arial}
        a {color: white; background-color: red; list-style: none; font-weight: 700; line-height: 1.6; margin-top: 10px; width: auto; padding: 5px; margin-left: 5px}
        h1 {text-size: 25px}
      </style>
    `
  })
}