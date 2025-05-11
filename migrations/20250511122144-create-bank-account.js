'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BankAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankIban: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankSwift: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Payments',
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

    await queryInterface.addIndex('BankAccounts', ['paymentId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BankAccounts');
  },
};
