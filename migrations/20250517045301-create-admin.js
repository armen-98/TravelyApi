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
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
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
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otpExpiration: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      deactivatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
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
