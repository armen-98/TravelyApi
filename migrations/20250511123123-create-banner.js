'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Banners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      widgetId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Widgets',
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

    await queryInterface.addIndex('Banners', ['widgetId']);
    // TODO: stex avelcrel ei imagi het relation
    // await queryInterface.addColumn('Images', 'bannerId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'Banners',
    //     key: 'id',
    //   },
    //   onDelete: 'SET NULL',
    // });
    //
    // await queryInterface.addIndex('Images', ['bannerId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Banners');
    // await queryInterface.removeColumn('Images', 'bannerId');
  },
};
