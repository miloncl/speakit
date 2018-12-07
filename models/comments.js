module.exports = function (sequelize, DataTypes) {
  var Comments = sequelize.define("Comments", {
    comment_id: DataTypes.STRING,
    comments: DataTypes.TEXT,
    voting: DataTypes.INTEGER,

  });
  return Comments;
};