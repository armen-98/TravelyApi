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
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Roles',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'Cascade',
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verifiedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      verifyCode: {
        allowNull: true,
        type: Sequelize.STRING,
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
