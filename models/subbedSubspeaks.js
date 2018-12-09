module.exports = function(sequelize, DataTypes) {
  var SubbedSS = sequelize.define("SubbedSubspeaks", {
    subspeak_name: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
  });
  return SubbedSS;
};
