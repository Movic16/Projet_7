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
        imageUrl : `${req.protocol}://${req.get('host')}/Images/${res.locals.NewName}`
    });
    console.log("book", book);

    book.save()
        .then(() => {res.status(201).json({message: 'Objet enregistré !'}); console.log("Enregistré du livre!")})
        .catch(error => {res.status(400).json({ error }); console.log("Livre non enregistré !")});
};

//Modification d'un livre
exports.modifyBook = (req, res, next) => {
    console.log("Vous modifier le livre");
    const BookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl : `${req.protocol}://${req.get('host')}/Images/${res.locals.NewName}` 
    } :{ ...req.body };

    delete BookObject._userId;
    CreatBook.findOne({_id : req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId)
            {
                res.status(401).json({message : 'Non-autorisé'});
                console.log("Vous êtes pas propriétaire de cette book");
            } else {
                CreatBook.updateOne({_id : req.params.id}, {...BookObject, _id : req.params.id})
                    .then(() => 
                    {
                        res.status(200).json({message: 'Book modifié !'}); 
                        console.log("Book modifié !")
                    })
                    .catch(error => {res.status(401).json({ error }); console.log("Le livre n'est pas modifié !")});
            }
        })
        .catch(error => {res.status(400).json({ error }); console.log("Erreur de modification du livre !")});
};

//Suppression d'un livre
exports.deleteBook = (req, res, next) => {
    //console.log("Supprimer les objets");
    //console.log("book.userId", book.userId);
    console.log("req.auth.userId", req.auth.userId);

    CreatBook.findOne({_id : req.params.id})
        .then((book) => {
            if(book.userId != req.auth.userId)
            {
                res.status(400).json({message : 'Non-autorisé'});
                console.log("Vous êtes pas propriétaire de ce livre.");
            } else {
                const filename = book.imageUrl.split('/Images/')[1];
                fs.unlink(`Images/${filename}`, () => {
                    CreatBook.deleteOne({_id : req.params.id})
                    .then(() => {res.status(200).json({message: 'Objet supprimé !'}); console.log("Livre supprimé !")})
                    .catch(error => {res.status(401).json({ error }); console.log("Le livre n'est pas supprimé !")});;
                })
            };
        })
        .catch(error => {res.status(500).json({ error }); console.log("Probleme de proprietaire ou suppression du book")});
};

//Recupere une seul livre
exports.getOneBook = (req, res, next) => {
    CreatBook.findOne({_id : req.params.id})
        .then(RecupBook => {
            
            res.status(200).json(RecupBook);
            //res.writeHead();
            //res.end();
            //res.redirect('livre/{req.params.id}');
            //location.reload(true);
            console.log("RecupBook", RecupBook);
            console.log("Le livre demander est bien trouver !");
            
        })
        .catch(error => {res.status(400).json({ error }); console.log("Le book demander n'est pas trouver !")});
        //location.reload(); 
};

//Recupere tous les livres
exports.getAllBooks = (req, res, next) => {
    CreatBook.find()
        .then(RecupBooks => {res.status(200).json(RecupBooks); console.log("Les books sont tous récupérer !")})
        .catch(error => {res.status(400).json({ error }); console.log("Les books ne sont pas tous récupérer !")});
};

//Renvoie des 3 livres ayant la meilleure note moyenne
exports.getBestrating = (req, res, next) => {
    
    CreatBook.find().sort({ averageRating: -1 })
         .then(books => {res.status(200).json([books[0], books[1], books[2]]); console.log("Les trois meilleurs livre qui sont mieux noté sont bien recuperer")})
         .catch(error => {res.status(400).json({ error }); console.log("Les trois meilleurs livre qui sont mieux noté ne sont pas bien recuperer")});
};

//Définit la note pour le user ID fourni
exports.postRating = (req, res, next) => {
    //console.log("Les objets de Rating");
    const ratingBody = req.body; //Recupere les informations userId et rating
    console.log("ratingBody", ratingBody);

    ratingBody.grade = ratingBody.rating;
    delete ratingBody.rating; //Supprimer le rating

    CreatBook.findOne({_id : req.params.id})
        .then(Book => {
            const UserIdExitant = Book.ratings.every(rating => rating.userId !== req.auth.userId);
            console.log("UserIdExitant", UserIdExitant);

            if (UserIdExitant === false)
            {
                res.status(400).json({ message : 'Vous ne pouuriez pas noté ce livre' });
                console.log("Vous pouuriez pas note ce livre");
            }
            else
            {
                CreatBook.findOneAndUpdate({_id : req.params.id}, {$push: {ratings: ratingBody}})
                    .then((Book) =>{
                        let averageRats = 0;
                        for (let i = 0; i < Book.ratings.length; i++) {
                            averageRats = averageRats + Book.ratings[i].grade;
                        }
                        console.log("averageRats", averageRats);
                        averageRats = averageRats /Book.ratings.length;

                        console.log("averageRats", averageRats);
                        Math.round(averageRats);
                        console.log("averageRats", averageRats);

                        CreatBook.findOneAndUpdate({_id : req.params.id}, {$set: {averageRating: averageRats}, _id: req.params.id}, {new: true})
                            .then((Book) => {res.status(201).json(Book); console.log("Livre trouver")})
                            .catch(error => {res.status(401).json({ error }); console.log("Livre n'est pas trouver")});
                    })
                    .catch(error => {res.status(400).json({ error }); /*console.log(error);*/ console.log("Probleme d'envoie de noté moyen")});
            }
        })
        .catch(error => {res.status(400).json({ error }); /*console.log(error);*/ console.log("Probleme au niveau rating ou auth")});
};