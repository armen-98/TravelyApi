'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class BankAccount extends Model {
    static associate({ User }) {
      BankAccount.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    }
  }
  BankAccount.init(
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bankCode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankIban: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bankSwift: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Payments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'BankAccount',
    },
  );
  return BankAccount;
};
