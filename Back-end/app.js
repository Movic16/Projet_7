//Importe la librairie
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const booksRoutes = require('./Routes/Book');
const userRoutes = require('./Routes/User');

//Connexion a la base de donnees
mongoose.connect('mongodb+srv://Admin:admin@projet7.vralzjw.mongodb.net/P7?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true 
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Permet d'appel la methode express
const app = express();
//console.log("app", app);

//Permet d'accéder à notre API depuis n'importe quelle origine, middleware premier à etre execute
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
next();
});

//Recuperer le cord de la requette
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));

/*app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});                                                                  

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});*/

//Appel des routes
app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;