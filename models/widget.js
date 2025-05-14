'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Widget extends Model {
    static associate({ Product, Category, Blog, Banner }) {
      Widget.belongsToMany(Product, {
        through: 'WidgetProducts',
        foreignKey: 'widgetId',
        otherKey: 'productId',
        as: 'products',
      });
      Widget.belongsToMany(Category, {
        through: 'WidgetCategories',
        foreignKey: 'widgetId',
        otherKey: 'categoryId',
        as: 'categories',
      });
      Widget.belongsToMany(Blog, {
        through: 'WidgetBlogs',
        foreignKey: 'widgetId',
        otherKey: 'blogId',
        as: 'blogs',
      });
      Widget.belongsTo(Banner, { foreignKey: 'id', as: 'banners' });
    }
  }
  Widget.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM(
          'listing',
          'category',
          'banner',
          'slider',
          'admob',
          'post',
        ),
        defaultValue: 'category',
      },
      direction: {
        type: Sequelize.ENUM('horizontal', 'vertical', 'grid'),
        defaultValue: 'vertical',
      },
      layout: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Widget',
    },
  );
  return Widget;
};
