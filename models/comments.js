module.exports = function (sequelize, DataTypes) {
  var Comments = sequelize.define("Comments", {
    comments: DataTypes.TEXT,
    voting: DataTypes.INTEGER,

  });

  Comments.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Comments.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });

    Comments.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Comments;
};
