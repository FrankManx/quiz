// Importar paquetes con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

// Rutas REST
// importar enrutadores
var routes = require('./routes/index');
//var users = require('./routes/users');

// Crear aplicación
var app = express();

// view engine setup
// instalar generador de vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// instalar middlewares
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('FrankManX-Quiz'));
app.use(methodOverride('_method'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Helpers dinamicos:
app.use(function(req, res, next) {
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});


// instalar enrutadores -> asociar rutas a sus gestores
app.use('/', routes);
//app.use('/users', users);

// error handlers

// catch 404 and forward to error handler
//resto de rutas: genera error 404 de HTTP
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
// gestión de errores durante el desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
// gestión de errores de producción
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

//exportar app para comando de arranque
module.exports = app;
