module.exports = function(sequelize, DataTypes) {
    var Comments = sequelize.define("Comments", {
      id: DataTypes.STRING,
      commenttext: DataTypes.TEXT,
      voting : DataTypes.INTERGER,

    });
    return Comments;
  };