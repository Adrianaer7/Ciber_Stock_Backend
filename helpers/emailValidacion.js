const nodemailer = require("nodemailer")

module.exports = emailRegistro = async (datos) => {
  const {nombre, email, token}  = datos

  const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
  });
  
  //Informacion del email
  await transport.sendMail({
    from: '"Stock - Ciber infotel" <adrianaerrc7@gmail.com>',
    to: email,
    subject: "Stock Ciber - Confirma tu cuenta",
    text: "Comprueba tu cuenta",
    html: ` 
      <h1>Hola, ${nombre}. Confirma tu cuenta</h1>
      <p>Tu cuenta está casi lista, solo debes comprobarla en el siguiente enlace: 
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">COMPROBAR CUENTA</a>
      </p>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
      <style>
        h1,p,a {font-family: Arial}
        a {color: white; background-color: red; list-style: none; font-weight: 700; line-height: 1.6; margin-top: 10px; width: auto; padding: 5px; margin-left: 5px}
        h1 {text-size: 25px}
      </style>
    `
  })

}