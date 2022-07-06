const Dolares = require("../models/Dolar");

exports.traerDolar = async (req, res, next) => {
  try {
    const { precio} = req.body
    const valor = await Dolares.findOne({precio})
    if(valor) {
      return res.json(valor)
    }
    await Dolares.deleteMany({});
  
    let dolar = new Dolares(req.body);
    await dolar.save();
    res.json({ dolar });
  } catch (error) {
    console.log(error)
  }
  
  
};

exports.editarManualmente = async(req, res, next) => {
  try {
    if(req.body.dolarManual) {
      const {dolarManual, automatico} = req.body
      let dolar = await Dolares.findOne({})
      const nuevoDolar = dolarManual
      dolarManual.automatico = automatico
      dolar  = await Dolares.findByIdAndUpdate({_id: dolar._id}, nuevoDolar, {new: true})
      dolar.save()
      res.json({dolar})
    } else {
      const {automatico} = req.body
      let dolar = await Dolares.findOne({})
      const nuevoDolar = dolar
      nuevoDolar.automatico = automatico
      dolar  = await Dolares.findByIdAndUpdate({_id: nuevoDolar._id}, nuevoDolar, {new: true})
      dolar.save()
      res.json({dolar})
    }
  } catch (error) {
    console.log(error)
  }
}

exports.enviarDolar = async (req, res, next) => {
  try {
    const dolar = await Dolares.find({}).select("-__v -_id")
    if(!dolar) return
    if(dolar) {
      res.json({ dolar });
    }
  } catch (error) {
    console.log(error)
  }
}
