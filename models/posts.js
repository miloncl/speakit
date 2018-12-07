module.exports = function (sequelize, DataTypes) {
  var Posts = sequelize.define("Post", {
    post_id: DataTypes.STRING,
    post_text: DataTypes.TEXT,
    tags: DataTypes.TEXT,
    categories: DataTypes.TEXT,
    views: DataTypes.INTERGER,
    title: DataTypes.TEXT
  });
  return Posts;
};