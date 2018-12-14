module.exports = function (sequelize, DataTypes) {
  var Posts = sequelize.define("Post", {
    post_text: DataTypes.TEXT,
    votes: DataTypes.INTEGER,
    title: DataTypes.TEXT
  });
  Posts.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Posts.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });

    Posts.hasMany(models.Comments, {
      onDelete: "cascade"
    });
  };

  Posts.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Posts.belongsTo(models.Subspeaks, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Posts;
};
