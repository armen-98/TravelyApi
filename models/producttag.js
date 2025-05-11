'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class ProductTag extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductTag.init(
    {
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
      tagId: {
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
      modelName: 'ProductTag',
    },
  );
  return ProductTag;
};
