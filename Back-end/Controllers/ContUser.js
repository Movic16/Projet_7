const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const mongoose = require('mongoose');

//Importe le model
const User = require('../Models/ModelUser');

//Creation d'un utilisateur
exports.signup = (req, res, next) => {

    //console.log("ContUser-req", req);
    //console.log("ContUser-res", res);

    bcrypt.hash(req.body.password, 10) //Hashage du mot de passe effectue 10 tour
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        
        console.log("user", user);
        //console.log("req.body", req.body);

       user.save()
        .then(() => {res.status(201).json({ message: 'Utilisateur créé !'}); console.log("Utilisateur créé !")})
        .catch( error => {res.status(400).json({ error }); console.log("Impossible de creer l'utilisateur!!!"); console.log(error);})
    })
    .catch(error => {res.status(500).json({ error }); console.log("Erreur au niveeau hash ou envoie des donneés aux BD")});
};

//se connecter
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'}); console.log("Utilisateur n'existe pas !");
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'}); console.log("identifiant/mot de passe incorrecte !");
                }else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                        
                    });
                    //localStorage.setItem("token", token);
                }
            })
            .catch(error => {
                res.status(500).json( {error} );
            })
        }
    })
    .catch(error => {
        res.status(500).json( {error} );
    })
}