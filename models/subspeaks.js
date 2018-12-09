module.exports = function (sequelize, DataTypes) {
  var Subspeaks = sequelize.define("Subspeaks", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    numberofsubs: DataTypes.INTEGER,
    icon: DataTypes.TEXT,  
    createdBy: DataTypes.INTEGER,
  });
  return Subspeaks;
};
