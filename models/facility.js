'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Facility extends Model {
    static associate({ Product }) {
      Facility.belongsToMany(Product, {
        through: 'productFacilities',
        foreignKey: 'facilityId',
        otherKey: 'productId',
        as: 'products',
      });
    }
  }
  Facility.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Facility',
    },
  );
  return Facility;
};
