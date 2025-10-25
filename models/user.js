'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    static associate({
      Role,
      File,
      Product,
      Blog,
      Comment,
      Booking,
      Claim,
      Wishlist,
      Payment,
      BankAccount,
      Admin,
    }) {
      User.hasOne(Admin, { foreignKey: 'userId', as: 'admin' });
      User.hasMany(File, {
        foreignKey: 'FileableId',
        constraints: false,
        scope: {
          fileableType: ['logo', 'photo', 'favicon', 'avatar'],
        },
      });
      User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
      User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
      User.hasMany(Product, { foreignKey: 'authorId', as: 'products' });
      User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
      User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
      User.hasMany(Claim, { foreignKey: 'userId', as: 'claims' });
      User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlists' });
      User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
      User.hasMany(BankAccount, { foreignKey: 'userId', as: 'bankAccounts' });
    }
  }
  User.init(
    {
      isPro: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Indicates whether the user has an active Pro subscription',
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
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
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
      notificationsEnabled: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true,
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
