module.exports = function(sequelize, DataTypes) {

    var users = sequelize.define("Users", {
      text: DataTypes.STRING,
      description: DataTypes.TEXT
    });
    return Example;
  };

