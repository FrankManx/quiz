//Definición dels models de Quiz
module.exports = function (sequelize, DataTypes) {
  return sequalize.define('Quiz',
    { pregunta: DataTypes.STRING,
      respuesta: DataTypes.STRING,
    });
}
