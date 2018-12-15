module.exports = function(sequelize, DataTypes) {
  var SubbedSS = sequelize.define("SubbedSubspeaks", {
    subspeak_name: DataTypes.STRING,
    subspeak_description: DataTypes.STRING,
  });

  
  SubbedSS.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    SubbedSS.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  SubbedSS.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    SubbedSS.belongsTo(models.Subspeaks, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return SubbedSS;
};
