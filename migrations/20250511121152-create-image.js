'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumb: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      bannerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

    await queryInterface.addIndex('Images', ['productId']);
    await queryInterface.addIndex('Images', ['blogId']);
    await queryInterface.addIndex('Images', ['categoryId']);
    await queryInterface.addIndex('Images', ['bannerId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Images');
  },
};
