'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConversationParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Conversation, User }) {
      ConversationParticipant.belongsTo(Conversation, {
        foreignKey: 'conversationId',
        as: 'conversation',
      });

      ConversationParticipant.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  ConversationParticipant.init(
    {
      conversationId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' },
      joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      sequelize,
      modelName: 'ConversationParticipant',
    },
  );
  return ConversationParticipant;
};
