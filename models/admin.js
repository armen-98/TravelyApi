'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      admin.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  admin.init(
    {
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
    },
    {
      sequelize,
      modelName: 'Admin',
    },
  );
  return admin;
};
