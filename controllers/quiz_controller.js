//importamos el Modelo
var models = require('../models/models.js');

// Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
          req.quiz = quiz;
          next();
      } else { next(new Error ('No existe la pregunta con quizId=' + quizId));}
    }
  ).catch (function(error) {next (error);});
};


//GET /quizes y /quizes?search
exports.index = function (req, res) {
  //console.log(req);
  //console.log(typeof req.query.search);
  if (typeof req.query.search !== "string") {
    models.Quiz.findAll().then(function(quizes) {res.render('quizes/index.ejs', {quizes: quizes}) });
    }
    else {
      var search = '%' + req.query.search.replace(' ', '%') + '%';
      models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes) {
        res.render('quizes/index.ejs', {quizes: quizes});
      });
    }
};

//GET /quizes/new
exports.new = function(req,res) {
  var quiz = models.Quiz.build( //Creamos objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  // guarda en DB los campos pregunta y respuesta de quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');   // res.redirect: Redirección HTTP a lista de preguntas
  })
};

//GET /quizes/:id
exports.show = function (req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz});
  })
};

//GET /quizes/:id/answer
exports.answer = function (req, res) {
  //console.log(req);
  //console.log(res);
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
    } else {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
    }
  })
};
