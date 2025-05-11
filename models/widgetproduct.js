'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class WidgetProduct extends Model {
    static associate(models) {
      // define association here
    }
  }
  WidgetProduct.init(
    {
      widgetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Widgets',
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
    },
    {
      sequelize,
      modelName: 'WidgetProduct',
    },
  );
  return WidgetProduct;
};
