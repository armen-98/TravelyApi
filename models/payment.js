'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Payment extends Model {
    static associate({ Booking, User, PaymentMethod }) {
      Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });
      Payment.belongsTo(PaymentMethod, {
        foreignKey: 'paymentMethodId',
        as: 'paymentMethod',
      });
    }
  }
  Payment.init(
    {
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
    },
    {
      sequelize,
      modelName: 'Payment',
    },
  );
  return Payment;
};
