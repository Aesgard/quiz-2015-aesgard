var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlit://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = (url[1] || null);
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar Modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite:
var sequelize = new Sequelize(DB_name, user, pwd, 
	{
		dialect:  protocol,
		protocol: protocol,
		port:     port,
		host:     host,
		storage:  storage,	// solo SQLite (.env)
		omitNull: true		// solo Postgres
	});

//Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definicion de la tabla Quiz

// sequelize.sync() crea e inicia tabla de preguntas en DB
sequelize.sync({force: true}).then(function() {
	//success(...) ejecuta el manejador una vez creada la tabla.
	Quiz.count().then(function(count) {
		if(count === 0) { //la tabla se inicializa solo i esta vacia
			Quiz.create({
				pregunta: 'Capital de Italia',
				respuesta: 'Roma',
				tema: 'humanidades'
				});
		}
		if(count < 2) {
			Quiz.create({
				pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa',
				tema: 'humanidades'
				});
		}
	}).then(function(){console.log('Base de datos inicializada')});
});

