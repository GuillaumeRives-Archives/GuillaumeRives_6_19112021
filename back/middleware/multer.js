//Import du module multer
const multer = require("multer");
const uuid = require("uuid");

//Définition d'une collection de types d'images
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png"
}

//Définition de la configuration de multer
const storage = multer.diskStorage({
    destination: (_request, _file, callback) => {
        callback(null, "images")
    },
    filename: (request, file, callback) => {
        const name = file.originalname.split("").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, uuid.v4() + "." + extension);
    }
});

//Export du module
module.exports = multer({
    storage
}).single("image");