'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Customer extends Model {
    static associate({ User }) {
      Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  Customer.init(
    {
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'Cascade',
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      comment: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      total: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Customer',
    },
  );
  return Customer;
};
