
//MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req,res,next)
{
  if (req.session.user)
  {
    var dateLast = new Date(req.session.lastTime);
    var dateNow = new Date();
    var diff = dateNow - dateLast;  //Diferencia en milisegundos
    console.log('Hora última actividad: '+ dateLast);
    console.log('Hora actual: '+ dateNow);
    console.log('Diferencia (ms): '+ diff);

    if (diff<= 120000) //Dos minutos
    {
      req.session.lastTime = dateNow;
      next();
    }
    else {
        delete req.session.user;
        res.redirect('/login');
    }
  }
  else  {
    res.redirect('/login');
  }
};


// Get /login   -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login   -- Crear la sesion si usuario se autentica
exports.create = function(req, res) {

    var login     = req.body.login;
    var password  = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

        if (error) {  // si hay error retornamos mensajes de error de sesión
            req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
            res.redirect("/login");
            return;
        }
        //Creo hora de activitad en la sesión
        req.session.lastTime = new Date();

        // Crear req.session.user y guardar campos   id  y  username
        // La sesión se define por la existencia de:    req.session.user
        req.session.user = {id:user.id, username:user.username};
        res.redirect(req.session.redir.toString());// redirección a path anterior a login
    });
};

// DELETE /logout   -- Destruir sesion
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // redirect a path anterior a login
};
