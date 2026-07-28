import Producto from "../models/Producto.js";
import multer from "multer";
import path from "path";
import { dirname } from "path"
import { fileURLToPath } from 'url';
import { generarId } from "../helpers/generar.js";

export const guardarImagen = async (req, res) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const ruta = path.parse(__dirname);
    const rutaModificada = (ruta.dir.replace("servidor", "cliente/public/imagenes"))

    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, rutaModificada);
        },
        filename: (req, file, cb) => {
            const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
            cb(null, `${generarId()}${extension}`);
        }
    });

    const configuracionMulter = {
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB (alineado con Nest)
        fileFilter: (req, file, cb) => {
            const ok = /jpeg|jpg|png|gif|webp|avif/i.test(file.mimetype)
            if (ok) return cb(null, true)
            cb(new Error("Formato de imagen no válido"))
        },
        storage: fileStorage
    }

    const upload = multer(configuracionMulter).single("archivo")

    upload(req, res, async (error) => {
        if (error) {
            console.log(error)
            return res.status(400).json({ msg: error.message || "Error al subir la imagen" })
        }

        try {
            if (!req.file) {
                return res.status(400).json({ msg: "No se recibió ningún archivo" })
            }

            const producto = await Producto.findOne({ imagen: req.file.originalname })
            if (!producto) {
                return res.status(404).json({ msg: "No se encontró el producto asociado a la imagen" })
            }

            producto.imagen = req.file.filename
            await Producto.findByIdAndUpdate({ _id: producto._id }, producto, { returnDocument: "after" })

            return res.json({ imagen: req.file.filename })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ msg: "Error al guardar la imagen" })
        }
    })
}
