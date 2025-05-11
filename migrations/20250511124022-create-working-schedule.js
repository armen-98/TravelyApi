'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WorkingSchedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      dayOfWeek: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      openAllDay: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isClosed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    await queryInterface.addIndex('WorkingSchedules', ['productId']);
    await queryInterface.addIndex('WorkingSchedules', ['dayOfWeek']);
    await queryInterface.addIndex(
      'WorkingSchedules',
      ['productId', 'dayOfWeek'],
      {
        unique: true,
      },
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('WorkingSchedules');
  },
};
