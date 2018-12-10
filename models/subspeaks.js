module.exports = function (sequelize, DataTypes) {
  var Subspeaks = sequelize.define("Subspeaks", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    numberofsubs: DataTypes.INTEGER,
    icon: DataTypes.TEXT,  
    createdBy: DataTypes.INTEGER,
  });

  Subspeaks.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Subspeaks.hasMany(models.SubbedSubspeaks, {
      onDelete: "cascade"
    });
  };

  Subspeaks.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Subspeaks.hasMany(models.Post, {
      onDelete: "cascade"
    });
  };
  return Subspeaks;
};
