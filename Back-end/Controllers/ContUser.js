const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Importe le model
const User = require('../Models/ModelUser');

//Creation d'un utilisateur
exports.signup =(req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Hashage du mot de passe effectue 10 tour
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
        .catch( error => {res.status(400).json({ error }); console.log("Impossible de creer l'utilisateur!!!")})
    })
    .catch(error => {res.status(500).json({ error }); console.log("Impossible d'hashe le mot de passe")});
};

//se connecter
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'});
                } else {
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                        )
                    });
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