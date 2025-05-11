module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Widgets', [
      {
        title: 'Featured Listings',
        description: 'Discover our top-rated listings',
        type: 'listing',
        direction: 'horizontal',
        layout: 'card',
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Popular Categories',
        description: 'Browse by category',
        type: 'category',
        direction: 'horizontal',
        layout: 'icon-circle',
        position: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Latest News',
        description: 'Stay updated with our latest articles',
        type: 'post',
        direction: 'vertical',
        layout: 'list',
        position: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '',
        description: '',
        type: 'banner',
        direction: 'horizontal',
        layout: null,
        position: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Featured Destinations',
        description: 'Explore popular destinations',
        type: 'slider',
        direction: 'horizontal',
        layout: null,
        position: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Widgets', null, {});
  },
};
