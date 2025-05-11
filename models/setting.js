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
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: true,
        defaultValue: null,
        onDelete: 'Cascade',
      },
      layout: {
        type: Sequelize.STRING,
        defaultValue: 'basic',
      },
      useLayoutWidget: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      perPage: {
        type: Sequelize.INTEGER,
        defaultValue: 20,
      },
      listMode: {
        type: Sequelize.STRING,
        defaultValue: 'list',
      },
      enableSubmit: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      minPrice: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      maxPrice: {
        type: Sequelize.FLOAT,
        defaultValue: 100.0,
      },
      colors: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
      unit: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
      },
      startHour: {
        type: Sequelize.STRING,
        defaultValue: '08:00',
      },
      endHour: {
        type: Sequelize.STRING,
        defaultValue: '18:00',
      },
      useViewAddress: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewPhone: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewFax: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewEmail: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewWebsite: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewSocial: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewDateEstablish: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewGalleries: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewAttachment: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewVideo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewMap: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewPrice: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewOpenHours: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewTags: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewFeature: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      useViewAdmob: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
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
