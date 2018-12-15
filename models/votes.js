module.exports = function (sequelize, DataTypes) {
  var Votes = sequelize.define("Votes", {
    votes: DataTypes.TEXT,

  });
  Votes.associate = function (models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Votes.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });

    Votes.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    });
  };


  return Votes;
};