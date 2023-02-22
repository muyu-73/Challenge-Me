"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    // users table
    await queryInterface.createTable("users", {
      username: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      totalscore: {
        default: 0,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userprofilephoto: {
        allowNull: true,
        type: Sequelize.STRING,
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
