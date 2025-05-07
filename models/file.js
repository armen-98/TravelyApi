'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate({ User }) {
      File.belongsTo(User, {
        foreignKey: 'FileableId',
        constraints: false,
      });
    }
  }
  File.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.STRING,
      },
      FileableId: {
        type: DataTypes.INTEGER,
      },
      FileableType: {
        type: DataTypes.STRING,
      },
      isMain: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'File',
    },
  );
  return File;
};
