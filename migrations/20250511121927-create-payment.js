'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: true,
        defaultValue: null,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      use: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      term: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      urlSuccess: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      urlCancel: {
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Payments');
  },
};
