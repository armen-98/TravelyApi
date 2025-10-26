"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  class Subscription extends Model {
    static associate({ User }) {
      Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });
    }
  }

  Subscription.init(
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      plan: {
        type: Sequelize.ENUM("monthly", "yearly"),
        allowNull: true,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      purchaseDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "canceled", "expired", "failed"),
        allowNull: false,
        defaultValue: "active",
      },
      rawReceipt: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Subscription",
      timestamps: true,
      paranoid: false,
    }
  );

  return Subscription;
};