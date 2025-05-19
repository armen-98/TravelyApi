'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Admins',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      permissions: {
        type: Sequelize.JSONB,
        defaultValue: {
          users: { view: true, create: true, update: true, delete: true },
          moderators: { view: true, create: true, update: true, delete: true },
          places: {
            view: true,
            create: true,
            update: true,
            delete: true,
            approve: true,
          },
          categories: { view: true, create: true, update: true, delete: true },
          locations: { view: true, create: true, update: true, delete: true },
          bookings: { view: true, update: true, delete: true },
          comments: { view: true, update: true, delete: true },
          posts: {
            view: true,
            create: true,
            update: true,
            delete: true,
            approve: true,
          },
        },
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Admins');
  },
};
