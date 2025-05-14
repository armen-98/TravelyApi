'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Image extends Model {
    static associate({ Product, Blog, Category, Banner }) {
      Image.hasOne(Product, { foreignKey: 'imageId', as: 'featuredProduct' });
      Image.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      Image.belongsTo(Blog, { foreignKey: 'blogId', as: 'featuredBlog' });
      Image.belongsTo(Category, { foreignKey: 'categoryId', as: 'categories' });
      Image.belongsTo(Banner, { foreignKey: 'bannerId', as: 'banner' });
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
