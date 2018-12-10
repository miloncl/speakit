module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define("Users", {
    user_email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    user_name: DataTypes.TEXT,
  });

  users.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    users.hasMany(models.SubbedSubspeaks, {
      onDelete: "cascade"
    });

    users.hasMany(models.Post, {
      onDelete: "cascade"
    });
  };

  return users; 
};
