'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class WorkingSchedule extends Model {
    static associate({ Product, TimeSlot }) {
      WorkingSchedule.belongsTo(Product, {
        foreignKey: 'productId',
        as: 'product',
      });
      WorkingSchedule.hasMany(TimeSlot, {
        foreignKey: 'scheduleId',
        as: 'timeSlots',
      });
    }
  }
  WorkingSchedule.init(
    {
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
    },
    {
      sequelize,
      modelName: 'WorkingSchedule',
    },
  );
  return WorkingSchedule;
};
