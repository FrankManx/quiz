var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar la definición de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Establecemos la relación 1-N entre Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comment

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // Para vaciar la tabla:
  //Quiz.destroy();

  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function (count){
     //La tabla se inicializa solo si está vacía
    if(count === 0) {
      Quiz.bulkCreate(
        [ { pregunta: 'Capital de Italia', respuesta: 'Roma', tema : 'geografia' },
          { pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema : 'geografia'  },
          { pregunta: 'Capital de Francia', respuesta: 'Paris', tema : 'geografia'  },
          { pregunta: 'Capital de Grecia', respuesta: 'Atenas', tema : 'geografia'  },
          { pregunta: 'Capital de Inglaterra', respuesta: 'Londres', tema : 'geografia'  }
        ]
      ).then(function(){console.log('Base de datos inicializada')});
    };
  }); // */
});
