'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
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
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      comment: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verifiedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
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
      verifyCode: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      deactivatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      isActive: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      facebookId: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      googleId: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      appleId: {
        allowNull: true,
        type: Sequelize.STRING,
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

    await queryInterface.addIndex('Users', ['email']);
    await queryInterface.addIndex('Users', ['username']);
    await queryInterface.addIndex('Users', ['roleId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
