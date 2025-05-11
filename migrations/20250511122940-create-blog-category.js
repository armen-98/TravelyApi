'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BlogCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('BlogCategories', ['blogId']);
    await queryInterface.addIndex('BlogCategories', ['categoryId']);
    await queryInterface.addIndex('BlogCategories', ['blogId', 'categoryId'], {
      unique: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('BlogCategories');
  },
};
