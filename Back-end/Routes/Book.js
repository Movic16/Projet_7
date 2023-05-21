//Importe la librairie
const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/ContBook');
const auth = require('../Middleware/auth');
const multer = require('../Middleware/multer-config');

router.post('/', auth, multer, bookCtrl.createBook); //Route creation d'objet
router.put('/:id', auth, multer, bookCtrl.modifyBook); //Route modification d'objet
router.delete('/:id', auth, bookCtrl.deleteBook); //Route suppression d'objet
router.get('/', bookCtrl.getAllBooks); //Route recuperer tous les objets
router.get('/:id', bookCtrl.getOneBook); //Route recuperer une seul d'objet

module.exports = router;