// MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
	if(req.session.user) {
		//Comprobar tiempo de registro (2 minutos: 120000 milisegundos).
		var now = new Date().getTime();
		if(now-req.session.stamp>120000) {
			delete req.session.user;
			req.session.errors = [{"message": 'Tiempo de session expirado !'}];
		} else {
			req.session.stamp = now;
			next();
		}
	}
	if(!req.session.user){
		res.redirect('/login');
	}
};

// Get /login -- Formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {}

	res.render('sessions/new', {errors: errors});
};

// Post /login -- Crear la sesion
exports.create = function(req, res) {
	var login    = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if(error) { //si hay error retornamos mensajes de error de sesion
			req.session.errors = [{"message": 'Se ha producido un error: '+error}];
			res.redirect("/login");
			return;
		}
		//Crear req.session.user y guardar campos id y username
		//La sesion se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username, stamp:new Date().getTime()};

		res.redirect(req.session.redir ? req.session.redir.toString() : '/'); //redireccion a path anterior a login
	});
};

// Delete /logout -- Destruir sesion
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir ? req.session.redir.toString() : '/'); //redirect a path anterior a login
};

