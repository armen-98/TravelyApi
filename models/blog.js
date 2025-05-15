'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Blog extends Model {
    static associate({ User, Category, Image, Comment, Widget }) {
      Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
      Blog.belongsToMany(Category, {
        through: 'BlogCategory',
        foreignKey: 'blogId',
        otherKey: 'categoryId',
        as: 'categories',
      });
      Blog.hasOne(Image, { foreignKey: 'blogId', as: 'image' });
      Blog.hasMany(Comment, { foreignKey: 'blogId', as: 'comments' });
      Blog.belongsToMany(Widget, {
        through: 'WidgetBlogs',
        foreignKey: 'blogId',
        otherKey: 'widgetId',
        as: 'widgets',
      });
    }
  }
  Blog.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'publish',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      numComments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'Blog',
    },
  );
  return Blog;
};
