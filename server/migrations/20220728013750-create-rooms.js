"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms", {
      roomid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        default: Sequelize.UUIDV4,
      },
      numofuser: {
        default: 0,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // 0 is waiting to start, 1 is playing
      status: {
        default: 0,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // 0 means this is a public room, 1 is private room
      type: {
        default: 1,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      currquestion: {
        default: 1, // First question is q1
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // foreign key related to topicname
      topicname: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "topics",
          key: "topicname",
        },
      },
      host: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "username",
        },
      },
      // foreign key related to qid in questions table
      q1: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q2: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q3: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q4: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      // foreign key related to qid in questions table
      q5: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "questions",
          key: "qid",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  },
};
