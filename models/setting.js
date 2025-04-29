'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Setting extends Model {
    static associate() {
      // define association here
    }
  }
  Setting.init(
    {
      language: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'en',
      },
      deviceId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceModel: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      os: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceVersion: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      deviceToken: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Setting',
    },
  );
  return Setting;
};
