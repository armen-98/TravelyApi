'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Feature extends Model {
    static associate(models) {
      // define association here
    }
  }
  Feature.init(
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
      modelName: 'Feature',
    },
  );
  return Feature;
};
