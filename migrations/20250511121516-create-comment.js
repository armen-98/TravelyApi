'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('Comments', ['userId']);
    await queryInterface.addIndex('Comments', ['productId']);
    await queryInterface.addIndex('Comments', ['blogId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Comments');
  },
};
