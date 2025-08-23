'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Conversation, User }) {
      Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
      Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
      Message.belongsToMany(User, { through: 'MessageReads' });
    }
  }
  Message.init(
    {
      conversationId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      content: { type: DataTypes.TEXT, allowNull: false },
      messageType: {
        type: DataTypes.ENUM('text', 'image', 'file'),
        defaultValue: 'text',
      },
      fileUrl: DataTypes.STRING,
      replyTo: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Messages',
          key: 'id',
        },
      },
      isEdited: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: 'Message',
    },
  );
  return Message;
};
