//importamos el Modelo
var models = require('../models/models.js');

// Autoload - Factoriza el código si la ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
  models.Quiz.find({
      where: { id: Number(quizId)},
      include: [{ model : models.Comment}]
  })
  .then(
    function(quiz) {
      if (quiz) {
          req.quiz = quiz;
          next();
      } else { next(new Error ('No existe la pregunta con quizId=' + quizId));}
    })
  .catch (function(error) {next (error)});
};


//GET /quizes y /quizes?search
exports.index = function (req, res, next) {
  //console.log(req);
  //console.log(typeof req.query.search);
  if (typeof req.query.search !== "string") {
    models.Quiz.findAll()
    .then(function(quizes) {res.render('quizes/index.ejs', {quizes: quizes, errors: []})})
    .catch (function(error){next(error)});
    }
    else {
      var search = '%' + req.query.search.replace(' ', '%') + '%';
      models.Quiz.findAll({where: ["pregunta like ?", search]})
      .then(function(quizes) {res.render('quizes/index.ejs', {quizes: quizes, errors: []});})
      .catch(function(error){next(error)});
    }
};


//GET /quizes/new
exports.new = function(req,res) {
  var quiz = models.Quiz.build( //Creamos objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res, next) {
  var quiz = models.Quiz.build(req.body.quiz);
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes')})
      }      // res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

//GET /quizes/:id
exports.show = function (req, res) {
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
  })
};

//GET /quizes/:id/edit
exports.edit = function (req, res) {
    var quiz= req.quiz; //autoload de instancia de quiz
    res.render('quizes/edit', { quiz: req.quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res, next) {
  var quiz= req.quiz;
  quiz.pregunta  = req.body.quiz.pregunta;
  quiz.respuesta = req.body.quiz.respuesta;
  quiz.tema = req.body.quiz.tema;

  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: quiz, errors: err.errors});
      } else {
        quiz
        .save( {fields: ["pregunta", "respuesta", "tema"]}) // save: guarda campos pregunta y respuesta en DB
        .then( function(){ res.redirect('/quizes');}); // Redirección HTTP a lista de preguntas (URL relativo)
      }
    })
  .catch(function(error){next(error)});
};


//GET /quizes/:id/answer
exports.answer = function (req, res) {
  //console.log(req);
  //console.log(res);
  models.Quiz.find(req.params.quizId).then(function(quiz) {
    if (req.query.respuesta === req.quiz.respuesta) {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors: []});
    } else {
      res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors: []});
    }
  })
};


// DELETE /quizes/:id
exports.destroy = function(req, res, next) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};
