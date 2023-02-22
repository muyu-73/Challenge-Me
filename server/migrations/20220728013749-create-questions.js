"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("questions", {
      qid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      questionphoto: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      questiontext: {
        allowNull: false,
        type: Sequelize.STRING(1000),
      },
      // answer letter shoud be A/B/C/D
      answerletter: {
        allowNull: false,
        type: Sequelize.CHAR(1),
      },
      optiona: {
        allowNull: false,
        type: Sequelize.STRING(500),
      },
      optionb: {
        allowNull: false,
        type: Sequelize.STRING(500),
      },
      optionc: {
        allowNull: false,
        type: Sequelize.STRING(500),
      },
      optiond: {
        allowNull: false,
        type: Sequelize.STRING(500),
      },
      // foreign key related to topicname, can not be null
      topicname: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "topics",
          key: "topicname",
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
