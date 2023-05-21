const multer = require('multer');

const MIME_TYPES ={
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
};

//Configuration de multer
const storage = multer.diskStorage({
    destination : (req, file, callback) =>{
        callback(null, 'Images')
    },

    filename : (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
}, console.log("Image ok reçu"));

module.exports = multer({ storage }).single('image');