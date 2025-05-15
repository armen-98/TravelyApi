'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Banner extends Model {
    static associate({ Widget, Image }) {
      Banner.belongsTo(Widget, { foreignKey: 'widgetId', as: 'banners' });
      Banner.hasOne(Image, { foreignKey: 'bannerId', as: 'image' });
    }
  }
  Banner.init(
    {
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      widgetId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Widgets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'slider',
      },
    },
    {
      sequelize,
      modelName: 'Banner',
    },
  );
  return Banner;
};
