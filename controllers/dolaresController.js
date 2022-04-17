const Dolares = require("../models/Dolar");

exports.traerDolar = async (req, res, next) => {

  const { precio} = req.body
  const valor = await Dolares.findOne({precio})
  if(valor) {
    return res.json(valor)
  }
  await Dolares.deleteMany({});

  let dolar = new Dolares(req.body);
  await dolar.save();
  res.json({ dolar });
  
  
};

exports.enviarDolar = async (req, res, next) => {
  const dolar = await Dolares.find({}).select("-__v -_id")
  if(!dolar) return
  if(dolar) {
    res.json({ dolar });
  }
}
