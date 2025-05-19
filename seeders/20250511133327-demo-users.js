const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    // Get role IDs
    const roles = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Roles"',
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    const adminRoleId = roles.find((role) => role.name === 'admin').id;
    const businessRoleId = roles.find((role) => role.name === 'business').id;
    const userRoleId = roles.find((role) => role.name === 'user').id;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Admin User',
          firstName: 'Admin',
          lastName: 'User',
          image: 'https://randomuser.me/api/portraits/men/1.jpg',
          url: '',
          level: 10,
          description: 'Administrator of the platform',
          tag: 'admin',
          rate: 5.0,
          comment: 0,
          total: 0,
          email: 'admin@example.com',
          username: 'admin',
          password: hashedPassword,
          verifiedAt: new Date(),
          roleId: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
          url: '',
          level: 1,
          description: 'Business owner with several listings',
          tag: 'business',
          rate: 4.5,
          comment: 5,
          total: 3,
          email: 'john@example.com',
          username: 'johndoe',
          password: hashedPassword,
          verifiedAt: new Date(),
          roleId: businessRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jane Smith',
          firstName: 'Jane',
          lastName: 'Smith',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
          url: '',
          level: 1,
          description: 'Regular user who books services',
          tag: 'user',
          rate: 4.8,
          comment: 8,
          total: 5,
          email: 'jane@example.com',
          username: 'janesmith',
          password: hashedPassword,
          verifiedAt: new Date(),
          roleId: userRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: true },
    );

    // create admin and connect with admin user
    await queryInterface.bulkInsert('Admins', [
      {
        phone: '+1234567890',
        userId: users[0].id,
        status: 'active',
        permissions: JSON.stringify({
          users: { view: true, create: true, update: true, delete: true },
          moderators: { view: true, create: true, update: true, delete: true },
          places: {
            view: true,
            create: true,
            update: true,
            delete: true,
            approve: true,
          },
          categories: { view: true, create: true, update: true, delete: true },
          locations: { view: true, create: true, update: true, delete: true },
          bookings: { view: true, update: true, delete: true },
          comments: { view: true, update: true, delete: true },
          posts: {
            view: true,
            create: true,
            update: true,
            delete: true,
            approve: true,
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    return users;
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
