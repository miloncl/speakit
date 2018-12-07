module.exports = function (sequelize, DataTypes) {
  var subspeaks = sequelize.define("Subspeaks", {
    user_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    numberofsub: DataTypes.INTEGER,
    icon: DataTypes.TEXT
  });
  return subspeaks;
};