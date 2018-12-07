module.exports = function(sequelize, DataTypes) {

    var users = sequelize.define("Users", {
      userid: DataTypes.STRING,
      email: DataTypes.TEXT,
      password :DataTypes.TEXT,
      username : DataTypes.TEXT,
      keysforsubspeak :DataTypes.TEXT
    });
    return users;
  };

