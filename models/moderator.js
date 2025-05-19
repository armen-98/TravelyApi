'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class moderator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Admin, Moderator }) {
      // Moderator.belongsTo(Admin, { as: 'manager', foreignKey: 'adminId' });
    }
  }
  moderator.init(
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
      adminId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Admins',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      permissions: {
        type: Sequelize.JSONB,
        defaultValue: {
          users: { view: true, update: false, delete: false },
          places: { view: true, update: true, delete: false, approve: true },
          comments: { view: true, update: true, delete: true },
          posts: { view: true, update: true, delete: false, approve: true },
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
      modelName: 'Moderator',
    },
  );
  return moderator;
};
