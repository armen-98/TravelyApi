'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Widgets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM(
          'listing',
          'category',
          'banner',
          'slider',
          'admob',
          'post',
        ),
        defaultValue: 'category',
      },
      direction: {
        type: Sequelize.ENUM('horizontal', 'vertical', 'grid'),
        defaultValue: 'vertical',
      },
      layout: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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

    await queryInterface.addIndex('Widgets', ['type']);
    await queryInterface.addIndex('Widgets', ['position']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Widgets');
  },
};
