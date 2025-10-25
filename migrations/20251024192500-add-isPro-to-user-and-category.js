'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'isPro', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Indicates whether the user has an active Pro subscription',
    });

    await queryInterface.addColumn('Categories', 'isPro', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Indicates whether the category is paid (Pro) or free',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Categories', 'isPro');
    await queryInterface.removeColumn('Users', 'isPro');
  },
};
