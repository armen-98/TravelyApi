'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'publish',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      numComments: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('Blogs', ['authorId']);
    await queryInterface.addIndex('Blogs', ['status']);
    await queryInterface.addIndex('Blogs', ['title']);
    // TODO: stex avelcrel ei imagi het relation
    // await queryInterface.addColumn('Images', 'blogId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'Blogs',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL',
    // });
    //
    // await queryInterface.addIndex('Images', ['blogId']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Blogs');
    // await queryInterface.removeColumn('Images', 'blogId');
  },
};
