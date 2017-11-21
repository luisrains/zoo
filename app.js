'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
//cargar rutas
//cargamos o ue esta en la carpeta routes, y userRoute
var user_routes = require('./routes/userRoutes');
var animal_routes = require('./routes/animalRoutes');

//configurarlos middelwares de body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras y cors
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods','GET, POST,OPTIONS,PUT,DELETE');
	res.header('Allow','GET, POST,OPTIONS,PUT,DELETE');
	next();
})
//ruta para el front
app.use('/',express.static('client',{redirect:false}));
//configuracioes de rutas bases
// /api para un prefijo de la url que esta en userRoute
app.use('/api',user_routes);
app.use('/api',animal_routes);

//para que refresque
app.get('*',function(req,res,next){
	res.sendFile(path.resolve('client/index.html'));
});



app.get('/probando', (req, res)=>{
	res.status(200).send({message: 'Este metodo se esta probando'});
})
module.exports = app;