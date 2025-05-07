'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    static associate({ Customer, File }) {
      User.hasOne(Customer, { foreignKey: 'userId', as: 'customer' });
      User.hasMany(File, {
        foreignKey: 'FileableId',
        constraints: false,
        scope: {
          fileableType: ['logo', 'photo', 'favicon', 'avatar'],
        },
      });
    }
  }
  User.init(
    {
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
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
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
      deletedAt: {
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
      otp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      otpExpiration: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
      deletedAt: 'deletedAt',
      timestamps: true,
    },
  );
  return User;
};
