'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Product extends Model {
    static associate({
      User,
      Category,
      Tag,
      Facility,
      WorkingSchedule,
      Location,
      Image,
      OpenTime,
      File,
      Comment,
      Widget,
    }) {
      Product.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
      Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
      Product.belongsToMany(Category, {
        through: 'productFeatures',
        foreignKey: 'productId',
        otherKey: 'categoryId',
        as: 'features',
      });
      Product.belongsToMany(Tag, {
        through: 'ProductTags',
        foreignKey: 'productId',
        otherKey: 'tagId',
        as: 'tags',
      });
      Product.belongsToMany(Facility, {
        through: 'productFacilities',
        foreignKey: 'productId',
        otherKey: 'facilityId',
        as: 'facilities',
      });
      Product.hasMany(WorkingSchedule, {
        foreignKey: 'productId',
        as: 'workingSchedules',
      });
      Product.belongsTo(Location, { foreignKey: 'countryId', as: 'country' });
      Product.belongsTo(Location, { foreignKey: 'stateId', as: 'state' });
      Product.belongsTo(Location, { foreignKey: 'cityId', as: 'city' });
      Product.belongsTo(Image, { foreignKey: 'imageId', as: 'image' });
      Product.hasMany(Image, { foreignKey: 'productId', as: 'galleries' });
      Product.hasMany(OpenTime, { foreignKey: 'productId', as: 'openHours' });
      Product.hasMany(File, { foreignKey: 'productId', as: 'attachments' });
      Product.hasMany(Comment, { foreignKey: 'productId', as: 'comments' });
      Product.belongsToMany(Widget, {
        through: 'WidgetProducts',
        as: 'widgetProducts',
        foreignKey: 'productId',
      });
    }
  }
  Product.init(
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      videoURL: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateEstablish: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rate: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      numRate: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      rateText: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      useClaim: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      claimVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      icon: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priceMin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priceMax: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priceDisplay: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bookingStyle: {
        type: Sequelize.STRING,
        defaultValue: 'standard',
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      stateId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Locations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      imageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Images',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      socials: {
        type: Sequelize.JSON,
        defaultValue: {},
      },
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );
  return Product;
};
