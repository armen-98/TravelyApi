'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceModel: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      os: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceVersion: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceToken: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
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
    await queryInterface.dropTable('Settings');
  },
};
