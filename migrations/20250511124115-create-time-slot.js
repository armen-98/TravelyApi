'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TimeSlots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'WorkingSchedules',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('TimeSlots', ['scheduleId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('TimeSlots');
  },
};
