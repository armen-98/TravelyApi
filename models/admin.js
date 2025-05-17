'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {}
  }
  admin.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [6, 100],
        },
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true,
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
    },
    {
      sequelize,
      modelName: 'Admin',
    },
  );
  return admin;
};
