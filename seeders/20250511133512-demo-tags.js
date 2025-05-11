module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tags', [
      {
        name: 'Family Friendly',
        slug: 'family-friendly',
        count: 10,
        color: '#4CAF50',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pet Friendly',
        slug: 'pet-friendly',
        count: 8,
        color: '#FF9800',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Romantic',
        slug: 'romantic',
        count: 6,
        color: '#E91E63',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Outdoor',
        slug: 'outdoor',
        count: 12,
        color: '#2196F3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Luxury',
        slug: 'luxury',
        count: 5,
        color: '#9C27B0',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Budget',
        slug: 'budget',
        count: 7,
        color: '#607D8B',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Historic',
        slug: 'historic',
        count: 4,
        color: '#795548',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Modern',
        slug: 'modern',
        count: 9,
        color: '#00BCD4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tags', null, {});
  },
};
