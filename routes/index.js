var express = require('express');
var router = express.Router();

var quizController = require ('../controllers/quiz_controller');
var authorController = require ('../controllers/author');
var searchController = require ('../controllers/search');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// autoload de comandos con :quizId
router.param('quizId', quizController.load);

// GET Quizes
router.get('/quizes', quizController.index);  // También se ocupa de las búsquedas
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create); //POST

//GET Author
router.get('/author', authorController.author);

// GET search form
router.get('/search', searchController.search);

module.exports = router;
