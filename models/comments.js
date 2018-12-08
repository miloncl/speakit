module.exports = function (sequelize, DataTypes) {
  var Comments = sequelize.define("Comments", {
    comments: DataTypes.TEXT,
    voting: DataTypes.INTEGER,

  });
  return Comments;
};
