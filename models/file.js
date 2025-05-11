'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class File extends Model {
    static associate({ User, Product }) {
      File.belongsTo(User, {
        foreignKey: 'FileableId',
        constraints: false,
      });
      File.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  File.init(
    {
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
      },
      path: {
        type: Sequelize.STRING,
      },
      FileableId: {
        type: Sequelize.INTEGER,
      },
      FileableType: {
        type: Sequelize.STRING,
      },
      isMain: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'File',
    },
  );
  return File;
};
