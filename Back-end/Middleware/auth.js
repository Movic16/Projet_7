const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //console.log("req",req);
        //console.log("req.headers.authorization", req.headers.authorization.split(' '));
        const token = req.headers.authorization.split(' ')[1];

        //const token = localStorage.getItem('tokens');
        console.log("token", token);

        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId  : userId
        };
        next();

        //console.log("req.auth", req.auth);
        console.log("Authantification reussie ");

    } catch(error){
        res.status(401).json({ error });
        console.log("Erreur d'auth");
        console.log("Erreur", error);
    }
};