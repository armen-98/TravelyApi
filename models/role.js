'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Role extends Model {
    static associate() {
      // define association here
    }
  }
  Role.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    },
  );
  return Role;
};
