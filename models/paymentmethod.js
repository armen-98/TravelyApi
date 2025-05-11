'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class PaymentMethod extends Model {
    static associate({ Payment }) {
      PaymentMethod.hasMany(Payment, {
        foreignKey: 'paymentMethodId',
        as: 'payments',
      });
    }
  }
  PaymentMethod.init(
    {
      methodId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      instruction: {
        type: Sequelize.TEXT,
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
    },
    {
      sequelize,
      modelName: 'PaymentMethod',
    },
  );
  return PaymentMethod;
};
