'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class WidgetBlog extends Model {
    static associate(models) {
      // define association here
    }
  }
  WidgetBlog.init(
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
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Blogs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'WidgetBlog',
    },
  );
  return WidgetBlog;
};
