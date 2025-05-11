'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Schedule extends Model {
    static associate({ OpenTime }) {
      Schedule.belongsTo(OpenTime, {
        foreignKey: 'openTimeId',
        as: 'openTime',
      });
    }
  }
  Schedule.init(
    {
      view: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      start: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      end: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      openTimeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OpenTimes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Schedule',
    },
  );
  return Schedule;
};
