'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Messages');
  },
};
