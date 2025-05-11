'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class WidgetCategory extends Model {
    static associate(models) {
      // define association here
    }
  }
  WidgetCategory.init(
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
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'WidgetCategory',
    },
  );
  return WidgetCategory;
};
