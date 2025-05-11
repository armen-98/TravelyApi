'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class BookingResource extends Model {
    static associate({ Booking }) {
      BookingResource.belongsTo(Booking, {
        foreignKey: 'bookingId',
        as: 'booking',
      });
    }
  }
  BookingResource.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      bookingId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'BookingResource',
    },
  );
  return BookingResource;
};
