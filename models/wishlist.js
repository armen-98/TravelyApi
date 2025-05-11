'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Wishlist extends Model {
    static associate({ User, Product }) {
      Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      Wishlist.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    }
  }
  Wishlist.init(
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
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
    },
    {
      sequelize,
      modelName: 'Wishlist',
    },
  );
  return Wishlist;
};
