'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class BlogCategory extends Model {
    static associate(models) {
      // define association here
    }
  }
  BlogCategory.init(
    {
      blogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Blogs',
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
      modelName: 'BlogCategory',
    },
  );
  return BlogCategory;
};
