module.exports = function(sequelize, DataTypes) {
    var Comments = sequelize.define("Comments", {
      text: DataTypes.STRING,
      description: DataTypes.TEXT
    });
    return Example;
  };