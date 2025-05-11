'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Claims', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      statusColor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priceDisplay: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      dueDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      paymentName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transactionID: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
      },
      totalDisplay: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billFirstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billLastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billPhone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billEmail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      billAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      allowCancel: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      allowPayment: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      allowAccept: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      paidOn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdVia: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      paymentMethodId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'PaymentMethods',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    await queryInterface.addIndex('Claims', ['userId']);
    await queryInterface.addIndex('Claims', ['productId']);
    await queryInterface.addIndex('Claims', ['paymentMethodId']);
    await queryInterface.addIndex('Claims', ['status']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Claims');
  },
};
