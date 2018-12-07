module.exports = function(sequelize, DataTypes) {

    var users = sequelize.define("Users", {
      user_id: DataTypes.STRING,
      email: DataTypes.TEXT,
      password :DataTypes.TEXT,
      user_name : DataTypes.TEXT,
      keysforsubspeak :DataTypes.TEXT
    });
    return users;
  };

