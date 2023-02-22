"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // topics table
    await queryInterface.createTable("topics", {
      topicname: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      topicphoto: {
        allowNull: true,
        type: Sequelize.STRING(1000),
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
