var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) { next(error); });
}

// GET /quizes
exports.index = function(req, res) {
	var search = req.query && req.query.search ? req.query.search : '';
	var options = {
		where: {
			pregunta: {
				like: '%'+(search.length>0 ? search.replace(/\ /g, "%")+'%' : '')
			}
		},
		order: [['pregunta', 'ASC']]
	};
	if(search.length>0) search = 'Preguntas que continene: "'+search+'"';
	models.Quiz.findAll(options).then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes, search: search});
	});
}

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz:req.quiz});
	});
}

//GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta)
			resultado = 'Correcto';
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
	});
};

//GET /author
exports.author = function(req, res) {
	res.render('author');
};
