import Producto from "../models/Producto.js";
import multer from "multer";
import path from "path";
import {dirname} from "path"
import { fileURLToPath } from 'url';
import { generarId } from "../helpers/generar.js";

export const guardarImagen = async(req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const ruta = path.parse(__dirname); //devuelve un objeto que dentro contiene la propiedad dir con : D:\\Documentos\\Documentos\\Cursos\\Curso React\\Proyectos\\Ciber\\servidor
    const rutaModificada = (ruta.dir.replace("servidor", "cliente/public/imagenes"))    //cambio la ruta para elegir donde quiero guardar las imagenes subidas. En este caso la guardo en el frontend
    
    //Configurar el multer

    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, rutaModificada); // cb es el callback, es para saber si hay errores. Si no hay errores queda como null
        },
        // Nombre y extensión del archivo
        filename: (req, file, cb) => {
            const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length); //evita que al subir archivos con nombre.descripcion.jpeg, multer no sepa cual es la extension del archivo por la cantidad de puntos. Con esto, toma siempre el ultimo punto como referencia
            cb(null, `${generarId()}${extension}`); //multer le pone nombres muy grandes a los archivos que subo, para eso uso mejor nanoid y le añido la extension
        }
    });

    const configuracionMulter = {
        //permito que se suban imagenes de hasta 50 megas
        limits: {fileSize: 50485760 },   
        //dónde se va a guardar el archivo
        storage: fileStorage
    }

    const upload = multer(configuracionMulter).single("archivo")    //single es porque le paso 1 solo archivo. archivo porque elijo el nombre que le voy a pasar desde el front en el formData

    
    upload(req, res, async (error) => { //importo error porque no es un trycatch        
        if(!error) {
            //busco un producto que contenga el nombre de la imagen original            
            const producto = await Producto.findOne({imagen: req.file.originalname})
            const {_id} = producto

            //cambio su nombre original por el generado por multer
            producto.imagen = req.file.filename

            //guardo el producto modificado
            await Producto.findByIdAndUpdate({_id}, producto, {new: true})
            
            res.json()  //muestra el nombre del archivo subido
        } else {
            console.log(error)
        }
    })

    res.json()
}