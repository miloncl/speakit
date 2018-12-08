module.exports = function (sequelize, DataTypes) {
  var Posts = sequelize.define("Post", {
    post_text: DataTypes.TEXT,
    tags: DataTypes.TEXT,
    categories: DataTypes.TEXT,
    views: DataTypes.INTEGER,
    title: DataTypes.TEXT
  });
  return Posts;
};
