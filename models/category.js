'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Category extends Model {
    static associate({ Product, Category, Blog, Widget, Image }) {
      Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
      Category.hasOne(Image, { foreignKey: 'categoryId', as: 'image' });
      Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
      Category.hasMany(Category, {
        foreignKey: 'parentId',
        as: 'subcategories',
      });
      Category.belongsToMany(Product, {
        through: 'productFeatures',
        foreignKey: 'categoryId',
        otherKey: 'productId',
        as: 'featuredProducts',
      });
      Category.hasMany(Blog, { foreignKey: 'categoryId', as: 'blogs' });
      Category.belongsToMany(Widget, {
        through: 'WidgetCategories',
        foreignKey: 'categoryId',
        otherKey: 'widgetId',
        as: 'widgets',
      });
    }
  }
  Category.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('category', 'location', 'feature'),
        defaultValue: 'category',
      },
      hasChild: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      imageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize,
      modelName: 'Category',
    },
  );
  return Category;
};
