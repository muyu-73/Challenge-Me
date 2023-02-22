"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class usersinrooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usersinrooms.init(
    {
      roomid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        references: {
          model: "rooms",
          key: "roomid",
        },
      },
      username: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
        references: {
          model: "users",
          key: "username",
        },
      },
      pid: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      // userstatus for this user is in the room - 1 OR not in the room - 0
      userstatus: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      // score in this particular room ONLY, default value is 0
      score: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "usersinrooms",
    }
  );
  return usersinrooms;
};
