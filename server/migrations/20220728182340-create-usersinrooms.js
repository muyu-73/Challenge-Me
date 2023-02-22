"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usersinrooms", {
      roomid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        references: {
          model: "rooms",
          key: "roomid",
        },
      },
      username: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "username",
        },
      },
      pid: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      // userstatus for this user is in the room - 1 OR not in the room - 0
      userstatus: {
        allowNull: false,
        type: Sequelize.INTEGER,
        default: 1,
      },
      // score in this particular room ONLY, default value is 0
      score:{
        allowNull: false,
        type: Sequelize.INTEGER,
        default: 0,
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
