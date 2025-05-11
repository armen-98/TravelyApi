module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Facilities', [
      {
        name: 'Wi-Fi',
        icon: 'wifi',
        description: 'Free Wi-Fi available',
        count: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Parking',
        icon: 'car',
        description: 'Parking available',
        count: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Air Conditioning',
        icon: 'snowflake',
        description: 'Air conditioning available',
        count: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Swimming Pool',
        icon: 'swimming-pool',
        description: 'Swimming pool available',
        count: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Gym',
        icon: 'dumbbell',
        description: 'Fitness center available',
        count: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Restaurant',
        icon: 'utensils',
        description: 'Restaurant on-site',
        count: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bar',
        icon: 'glass-martini-alt',
        description: 'Bar on-site',
        count: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Room Service',
        icon: 'concierge-bell',
        description: 'Room service available',
        count: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Spa',
        icon: 'spa',
        description: 'Spa services available',
        count: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Wheelchair Accessible',
        icon: 'wheelchair',
        description: 'Wheelchair accessible facilities',
        count: 11,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Facilities', null, {});
  },
};
