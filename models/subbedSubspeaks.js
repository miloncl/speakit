module.exports = function(sequelize, DataTypes) {
  var SubbedSS = sequelize.define("SubbedSubspeaks", {
    subspeak_id: DataTypes.INTEGER,
    subspeak_name: DataTypes.TEXT,
    subspeak_description: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
  });
  return SubbedSS;
};
