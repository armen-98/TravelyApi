'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductFacilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      facilityId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Facilities',
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

    await queryInterface.addIndex('ProductFacilities', ['productId']);
    await queryInterface.addIndex('ProductFacilities', ['facilityId']);
    await queryInterface.addIndex(
      'ProductFacilities',
      ['productId', 'facilityId'],
      {
        unique: true,
      },
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable('ProductFacilities');
  },
};
