module.exports = function(sequelize, DataTypes) {
  var Example = sequelize.define("Subspeaks", {
    sp_id: DataTypes.INTEGER,
    text: DataTypes.STRING,
    description: DataTypes.TEXT
  });
  return Example;
};
