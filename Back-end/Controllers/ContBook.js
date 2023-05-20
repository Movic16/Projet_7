Thing = require('../Models/ModelBook');

//Creation des livres
exports.createBook = (req, res, next) =>{
    delete req.body._id;
    const thing = Thing({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};