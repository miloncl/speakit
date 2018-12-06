module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Users", {
    username: DataTypes.STRING,
    email: DataTypes.TEXT,
    password: DataTypes.STRING
  });
  return Example;
};