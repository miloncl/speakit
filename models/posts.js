module.exports = function(sequelize, DataTypes) {
    var Posts = sequelize.define("Post", {
      id:DataTypes.STRING,
    posttext:DataTypes.TEXT,
    tags :DataTypes.TEXT,
    categories:DataTypes.TEXT,
    views:DataTypes.INTERGER,
    title:DataTypes.TEXT
    });
    return Post;
  };