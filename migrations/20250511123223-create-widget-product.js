'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WidgetProducts', {
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('WidgetProducts', ['widgetId']);
    await queryInterface.addIndex('WidgetProducts', ['productId']);
    await queryInterface.addIndex('WidgetProducts', ['widgetId', 'productId'], {
      unique: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('WidgetProducts');
  },
};
