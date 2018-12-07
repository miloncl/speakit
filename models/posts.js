module.exports = function(sequelize, DataTypes) {
    var Posts = sequelize.define("Post", {
      text: DataTypes.STRING,
      description: DataTypes.TEXT
    });
    return Example;
  };