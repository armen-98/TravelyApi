'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WidgetBlogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      widgetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Widgets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('WidgetBlogs', ['widgetId']);
    await queryInterface.addIndex('WidgetBlogs', ['blogId']);
    await queryInterface.addIndex('WidgetBlogs', ['widgetId', 'blogId'], {
      unique: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('WidgetBlogs');
  },
};
