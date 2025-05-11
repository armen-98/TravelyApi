'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class OpenTime extends Model {
    static associate({ Product, Schedule }) {
      OpenTime.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      OpenTime.hasMany(Schedule, { foreignKey: 'openTimeId', as: 'schedules' });
    }
  }
  OpenTime.init(
    {
      dayOfWeek: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: 'OpenTime',
    },
  );
  return OpenTime;
};
