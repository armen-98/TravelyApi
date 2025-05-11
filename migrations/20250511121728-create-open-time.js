'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OpenTimes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dayOfWeek: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.addIndex('OpenTimes', ['productId']);
    await queryInterface.addIndex('OpenTimes', ['dayOfWeek']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('OpenTimes');
  },
};
