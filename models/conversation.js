'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Message }) {
      Conversation.belongsToMany(User, {
        through: 'ConversationParticipants',
        foreignKey: 'conversationId',
        as: 'participants',
      });
      Conversation.hasMany(Message, { foreignKey: 'conversationId' });
    }
  }
  Conversation.init(
    {
      name: Sequelize.STRING,
      type: { type: Sequelize.ENUM('direct', 'group'), defaultValue: 'direct' },
      createdBy: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' },
      },
    },
    {
      sequelize,
      modelName: 'Conversation',
    },
  );
  return Conversation;
};
