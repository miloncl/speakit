module.exports = function (sequelize, DataTypes) {
  var subspeaks = sequelize.define("Subspeaks", {
    user_name: DataTypes.STRING,
    description: DataTypes.TEXT,
    views: DataTypes.INTERGER,
    numberofsub: DataTypes.INTERGER,
    icon: DataTypes.TEXT
  });
  return subspeaks;
};