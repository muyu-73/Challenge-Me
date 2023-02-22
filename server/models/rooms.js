"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rooms.init(
    {
      roomid: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      numofuser: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 0 is waiting to start, 1 is playing
      status: {
        defaultValue: 0,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 0 means this is a public room, 1 is private room
      type: {
        defaultValue: 1,
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currquestion: {
        defaultValue: 1, // First question is q1
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // foreign key related to topicname
      topicname: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "topics",
          key: "topicname",
        },
      },
      host: {
        allowNull: true,
        type: DataTypes.STRING,
        references: {
          model: "users",
          key: "username",
        },
      },
      // foreign key related to qid in questions table
      q1: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q2: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q3: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q4: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q5: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
          model: "questions",
          key: "qid",
        },
      },
    },
    {
      sequelize,
      modelName: "rooms",
    }
  );
  return rooms;
};
