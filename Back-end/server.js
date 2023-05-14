//Importe les librairies
const http = require('http');
const app = require('./app');

//Recherche un port valide
const normalizePort = val =>{
    const port = parseInt(val, 10);

    if(isNaN(port))
    {
        return val;
    }

    if(port >= 0)
    {
        return port;
    }
    return false;
};

//Choix du Port utilise
const port = normalizePort(process.env.PORT || 3000)
app.set('port', port);

//Recherche les differentes erreur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;

      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;

      default:
        throw error;
    }
};

//Creation du serveur
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', ()=>{
    const adress = server.address();
    const bind = typeof address === 'string' ? 'pipe' + adress : ' port ' + port;
    console.log('Listening on' + bind); //Affichage du port de serveur 
});

server.listen(port);