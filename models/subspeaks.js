module.exports = function(sequelize, DataTypes) {
    var subspeaks = sequelize.define("Subspeaks", {
      text: DataTypes.STRING,
      description: DataTypes.TEXT
    });
    return Example;
  };