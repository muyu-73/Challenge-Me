"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  questions.init(
    {
      qid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      questionphoto: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      questiontext: {
        allowNull: false,
        type: DataTypes.STRING(1000),
      },
      // answer letter shoud be A/B/C/D
      answerletter: {
        allowNull: false,
        type: DataTypes.CHAR(1),
      },
      optiona: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      optionb: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      optionc: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      optiond: {
        allowNull: false,
        type: DataTypes.STRING(500),
      },
      // foreign key related to topicname, can not be null
      topicname: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "topics",
          key: "topicname",
        },
      },
    },
    {
      sequelize,
      modelName: "questions",
    }
  );
  return questions;
};
