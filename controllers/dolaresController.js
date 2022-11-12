const Dolares = require("../models/Dolar");

exports.traerDolar = async (req, res, next) => {
  try {
    const { precio} = req.body
    const elDolar = await Dolares.findOne({creador: req.usuario.id}) //encuentro el dolar creado por el usuario registrado
    
    if(elDolar) {
      if(elDolar.precio === precio) {  //si el usuario creó un dolar y es igual al que me traigo del body, le retorno el que ya tengo
        return res.json(elDolar)
      } else {
        await Dolares.deleteMany({creador: req.usuario.id});  //si el creador ya creo un dolar, pero el precio del body es diferente, elimino el objeto de dolar y creo uno nuevo
      }
    }
  
    let dolar = new Dolares(req.body);
    dolar.creador = req.usuario.id
    await dolar.save();
    res.json({ dolar });
  } catch (error) {
    console.log(error)
  }
};

exports.editarManualmente = async(req, res, next) => {
  try {
    if(req.body.dolarManual) {  //cuando edito el valor del dolar manualmente
      const {dolarManual} = req.body
      let dolar = await Dolares.findOne({creador: req.usuario.id})
      const nuevoDolar = dolarManual
      nuevoDolar.automatico = false
      dolar  = await Dolares.findByIdAndUpdate({_id: dolar._id}, nuevoDolar, {new: true})
      dolar.save()
      res.json({dolar})
    } else {  //cuando elimino el valor del dolar manual
      let dolar = await Dolares.findOne({creador: req.usuario.id})
      const nuevoDolar = dolar
      nuevoDolar.automatico = true
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
    const dolar = await Dolares.find({creador: req.usuario.id}).select("-__v -_id")
    res.json({dolar})
  } catch (error) {
    console.log(error)
  }
}
