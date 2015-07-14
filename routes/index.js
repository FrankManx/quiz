var express = require('express');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');
var authorController = require ('../controllers/author');
var searchController = require ('../controllers/search');
var commentController = require ('../controllers/comment_controller');
var sessionController = require ('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// autoload de comandos con :quizId
router.param('quizId', quizController.load);

// GET Quizes
router.get('/quizes',                       quizController.index);  // También se ocupa de las búsquedas
router.get('/quizes/:quizId(\\d+)',         quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',  quizController.answer);
router.get('/quizes/new',                   quizController.new);
router.post('/quizes/create',               quizController.create); //POST
router.get('/quizes/:quizId(\\d+)/edit',    quizController.edit);
router.put('/quizes/:quizId(\\d+)',         quizController.update); //PUT
router.delete('/quizes/:quizId(\\d+)',      quizController.destroy); //DELETE

//Comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',  commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',  commentController.create);

// Definición de rutas de sesion
router.get('/login',    sessionController.new);     // formulario login
router.post('/login',   sessionController.create);  // crear sesión
router.get('/logout',   sessionController.destroy); // destruir sesión

//GET Author
router.get('/author',   authorController.author);

// GET search form
router.get('/search',   searchController.search);

module.exports = router;
