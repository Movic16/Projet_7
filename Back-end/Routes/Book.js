//Importe la librairie
const express = require('express');
const router = express.Router();
const bookCtrl = require('../Controllers/ContBook');

router.post('/', bookCtrl.createBook);

module.exports = router;