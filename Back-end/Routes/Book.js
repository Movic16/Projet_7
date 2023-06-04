//Importe la librairie
const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/ContBook');
const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config');

router.post('/', auth, multer.imgUploader, multer.imgResize, bookCtrl.createBook); //Route creation d'objet
router.put('/:id', auth, multer.imgUploader, multer.imgResize, bookCtrl.modifyBook); //Route modification d'objet
router.delete('/:id', auth, bookCtrl.deleteBook); //Route suppression d'objet
router.get('/bestrating', bookCtrl.getBestrating); //Renvoie des 3 livres ayant la meilleure note moyenne
router.get('/:id', bookCtrl.getOneBook); //Route recuperer une seul d'objet
router.get('/', bookCtrl.getAllBooks); //Route recuperer tous les objets
router.post('/:id/rating', auth, bookCtrl.postRating); //Définit la note pour le user ID fourni

module.exports = router;