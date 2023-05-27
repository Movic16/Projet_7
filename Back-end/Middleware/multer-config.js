const multer = require('multer');
const sharp = require('sharp');

const MIME_TYPES ={
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png',
    'image/webp' : 'webp',
};

//Configuration de multer
/*const storage = multer.diskStorage({
    destination : (req, file, callback) =>{
        callback(null, 'Images')
    },

    filename : (req, file, callback) =>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    },
}, console.log("Image ok reçu"));*/

const storage = multer.memoryStorage();

//Filter les images
const Filter = ( req ,  file ,  cb ) =>{
    if (file.mimetype.split("/")[0] === 'image') 
    {
        cb (null ,  true);
        console.log("Image ok reçu");
    }
    else
    {
        cb (new  Error ( 'Seules les images sont autorisées!!'))
    }
};

exports.imgUploader = multer({ storage, fileFilter: Filter}).single('image');
//module.exports = multer({ storage }).single('image');

exports.imgResize = async (req, res, next) => {
    //console.log("req", req);
    const name = req.file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[req.file.mimetype];
    const NewName = name + Date.now() + '.' + extension;

    const path = `./Images/${NewName}`;
    console.log("path", path);

    await sharp(req.file.buffer)
        .resize(400, 450)
        .toFile(path );

    res.locals.NewName = NewName;
    console.log("Image dimensionner");
    next()
}