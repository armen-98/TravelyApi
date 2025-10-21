module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert countries
    const countries = await queryInterface.bulkInsert(
      'Locations',
      [
        {
          name: 'United States',
          type: 'country',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'United Kingdom',
          type: 'country',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Canada',
          type: 'country',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Armenia',
          type: 'country',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true },
    );

    // Get country IDs
    const usId = countries[0].id;
    const ukId = countries[1].id;
    const caId = countries[2].id;
    const amId = countries[3].id;

    // Insert states
    const states = await queryInterface.bulkInsert(
      'Locations',
      [
        {
          name: 'California',
          type: 'state',
          parentId: usId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'New York',
          type: 'state',
          parentId: usId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Texas',
          type: 'state',
          parentId: usId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'England',
          type: 'state',
          parentId: ukId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Scotland',
          type: 'state',
          parentId: ukId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Ontario',
          type: 'state',
          parentId: caId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Quebec',
          type: 'state',
          parentId: caId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Yerevan',
          type: 'state',
          parentId: amId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true },
    );

    // Get state IDs
    const caStateId = states[0].id;
    const nyStateId = states[1].id;
    const txStateId = states[2].id;
    const englandId = states[3].id;
    const scotlandId = states[4].id;
    const ontarioId = states[5].id;
    const quebecId = states[6].id;
    const yerevanId = states[7].id;

    // Insert cities
    return queryInterface.bulkInsert('Locations', [
      {
        name: 'Los Angeles',
        type: 'city',
        parentId: caStateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'San Francisco',
        type: 'city',
        parentId: caStateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'New York City',
        type: 'city',
        parentId: nyStateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Buffalo',
        type: 'city',
        parentId: nyStateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dallas',
        type: 'city',
        parentId: txStateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Houston',
        type: 'city',
        parentId: txStateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'London',
        type: 'city',
        parentId: englandId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Manchester',
        type: 'city',
        parentId: englandId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Edinburgh',
        type: 'city',
        parentId: scotlandId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Glasgow',
        type: 'city',
        parentId: scotlandId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Toronto',
        type: 'city',
        parentId: ontarioId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ottawa',
        type: 'city',
        parentId: ontarioId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Montreal',
        type: 'city',
        parentId: quebecId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Quebec City',
        type: 'city',
        parentId: quebecId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Yerevan',
        type: 'city',
        parentId: yerevanId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Locations', null, {});
  },
};
