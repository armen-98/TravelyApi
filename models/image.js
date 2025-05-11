'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Image extends Model {
    static associate({ Product, Blog, Category }) {
      Image.hasOne(Product, { foreignKey: 'imageId', as: 'featuredProduct' });
      Image.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      Image.hasOne(Blog, { foreignKey: 'imageId', as: 'featuredBlog' });
      Image.belongsTo(Category, { foreignKey: 'categoryId', as: 'categories' });
    }
  }
  Image.init(
    {
      full: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumb: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      bannerId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Image',
    },
  );
  return Image;
};
