'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Booking extends Model {
    static associate({ BookingResource, Payment, Product, User }) {
      Booking.hasMany(BookingResource, {
        foreignKey: 'bookingId',
        as: 'resources',
      });
      Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' });
      Booking.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Booking.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },
      statusColor: {
        type: Sequelize.STRING,
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
        type: Sequelize.FLOAT,
        defaultValue: 0,
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
      startDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      adult: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      children: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      bookingStyle: {
        type: Sequelize.STRING,
        defaultValue: 'standard',
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
      modelName: 'Booking',
    },
  );
  return Booking;
};
