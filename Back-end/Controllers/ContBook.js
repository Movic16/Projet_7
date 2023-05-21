const { JsonWebTokenError } = require('jsonwebtoken');

CreatBook = require('../Models/ModelBook');
const auth = require('../Middleware/auth');
const fs = require('fs');

//Creation des livres
exports.createBook = (req, res, next) =>{
    //console.log("BookObject creation");

    const BookObject = JSON.parse(req.body.book);
    //console.log("BookObject", BookObject);

    delete BookObject._id;
    delete BookObject._userId;

    const book = new CreatBook({
        ...BookObject,
        userId : req.auth.userId,
        imageUrl : `${req.protocol}://${req.get('host')}/Images/${req.file.filename}`
    });
    console.log("book", book);

    book.save()
        .then(() => {res.status(201).json({message: 'Objet enregistré !'}); console.log("Objet enregistré !")})
        .catch(error => {res.status(400).json({ error }); console.log("Objet non enregistré !")});
};

//Modification d'un livre
exports.modifyBook = (req, res, next) => {
    const BookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl : `${req.protocol}://${req.get('host')}/Images/${req.file.filename}` 
    } :{ ...req.body };

    delete BookObject.userId;
    CreatBook.findOne({_id : req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId)
            {
                res.status(400).json({message : 'Non-autorisé'});
                console.log("Vous etes pas propriétaire de cette objeet");
            } else {
                CreatBook.updateOne({_id : req.params.id}, {...req.body, _id : req.params.id})
                    .then(() => {res.status(200).json({message: 'Objet modifié !'}); console.log("Objet modifié !")})
                    .catch(error => {res.status(400).json({ error }); console.log("Objet n'est pas modifié !")});
            }
        })
        .catch(error => {res.status(400).json({ error }); console.log("Objet n'est pas modifié !")});
};

//Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    CreatBook.findOne({_id : req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId)
            {
                res.status(400).json({message : 'Non-autorisé'});
                console.log("Vous etes pas propriétaire de cette objeet pour supprimer cette objet");
            } else {
                const filename = book.imageUrl.split('/Images/')[1];
                fs.unlink(`Images/${filename}`, () => {
                    CreatBook.deleteOne({_id : req.params.id})
                    .then(() => {res.status(200).json({message: 'Objet supprimé !'}); console.log("Objet supprimé !")})
                    .catch(error => {res.status(400).json({ error }); console.log("Objet n'est pas supprimé !")});;
                })
            }
        })
        .catch(error => {res.status(400).json({ error }); console.log("Probleme de proprietaire ou suppression d'objet")});
};

//Recupere une seul livre
exports.getOneBook = (req, res, next) => {
    CreatBook.findOne({_id : req.params.id})
        .then(RecupBook => {res.status(200).json(RecupBook); console.log("L'objet demander est bien trouver !")})
        .catch(error => {res.status(400).json({ error }); console.log("L'objet demander n'est pas trouver !")});
};

//Recupere une seul livre
exports.getAllBooks = (req, res, next) => {
    CreatBook.find()
        .then(RecupBooks => {res.status(200).json(RecupBooks); console.log("Les objets sont tous récupérer !")})
        .catch(error => {res.status(400).json({ error }); console.log("Les objets ne sont pas tous récupérer !")});
};