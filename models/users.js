module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define("Users", {
    user_email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    user_name: DataTypes.TEXT,
  });
  return users;
};
