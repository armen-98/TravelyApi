'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Location extends Model {
    static associate({ Product, Location }) {
      Location.hasMany(Product, {
        foreignKey: 'countryId',
        as: 'countryProducts',
      });
      Location.hasMany(Product, { foreignKey: 'stateId', as: 'stateProducts' });
      Location.hasMany(Product, { foreignKey: 'cityId', as: 'cityProducts' });
      Location.belongsTo(Location, { foreignKey: 'parentId', as: 'parent' });
      Location.hasMany(Location, {
        foreignKey: 'parentId',
        as: 'children',
      });
    }
  }
  Location.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('country', 'state', 'city'),
        allowNull: false,
      },
      parentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    },
    {
      sequelize,
      modelName: 'Location',
    },
  );
  return Location;
};
