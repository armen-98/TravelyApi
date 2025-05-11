'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Role extends Model {
    static associate({ User }) {
      Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
    }
  }
  Role.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      permissions: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'Role',
    },
  );
  return Role;
};
