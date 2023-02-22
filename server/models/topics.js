"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class topics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  topics.init(
    {
      topicname: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      topicphoto: {
        allowNull: true,
        type: DataTypes.STRING(1000),
      },
    },
    {
      sequelize,
      modelName: "topics",
    }
  );
  return topics;
};
