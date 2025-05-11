'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Comment extends Model {
    static associate({
      Blog,
      Product,
      User,
      Claim,
      Booking,
      Wishlist,
      Widget,
    }) {
      Comment.belongsTo(Blog, { foreignKey: 'blogId', as: 'blog' });
      Comment.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
      Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      Product.hasMany(Claim, { foreignKey: 'productId', as: 'claims' });
      Product.hasMany(Booking, { foreignKey: 'productId', as: 'bookings' });
      Product.hasMany(Wishlist, { foreignKey: 'productId', as: 'wishlists' });
      Product.belongsToMany(Widget, {
        through: 'WidgetProducts',
        foreignKey: 'productId',
        otherKey: 'widgetId',
        as: 'widgets',
      });
    }
  }
  Comment.init(
    {
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      postName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
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
        allowNull: true,
        references: {
          model: 'Products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Blogs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Comment',
    },
  );
  return Comment;
};
