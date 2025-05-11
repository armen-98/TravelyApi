'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class TimeSlot extends Model {
    static associate({ WorkingSchedule }) {
      TimeSlot.belongsTo(WorkingSchedule, {
        foreignKey: 'scheduleId',
        as: 'schedule',
      });
    }
  }
  TimeSlot.init(
    {
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
    },
    {
      sequelize,
      modelName: 'TimeSlot',
    },
  );
  return TimeSlot;
};
