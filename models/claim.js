'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Claim extends Model {
    static associate({ Product, User }) {
      Claim.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      Claim.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Claim.init(
    {
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
    },
    {
      sequelize,
      modelName: 'Claim',
    },
  );
  return Claim;
};
