'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class ProductFacility extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductFacility.init(
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
      facilityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Facilities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'ProductFacility',
    },
  );
  return ProductFacility;
};
