'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Tag extends Model {
    static associate({ Product }) {
      Tag.belongsToMany(Product, {
        through: 'ProductTags',
        foreignKey: 'tagId',
        otherKey: 'productId',
        as: 'products',
      });
    }
  }
  Tag.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Tag',
    },
  );
  return Tag;
};
