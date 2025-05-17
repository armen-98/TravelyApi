'use strict';
const authService = require('../services/auth');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Create a super admin and regular admins
    const admins = [];

    // Hash passwords
    const defaultPassword = await authService.hashPassword('password123');

    // 1. Super Admin
    const superAdmin = {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: defaultPassword,
      phone: '+1234567890',
      profileImage: null,
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
      lastLoginAt: null,
      otp: null,
      otpExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdSuperAdmin = await queryInterface.bulkInsert(
      'Admins',
      [superAdmin],
      { returning: true },
    );

    const adminId = createdSuperAdmin[0].id;
    // 2. Content Admin (focus on content management)
    admins.push({
      adminId,
      name: 'Content Admin',
      email: 'content@example.com',
      password: defaultPassword,
      phone: '+1234567891',
      profileImage: null,
      status: 'active',
      permissions: JSON.stringify({
        users: { view: true, create: false, update: false, delete: false },
        moderators: { view: true, create: true, update: true, delete: false },
        places: {
          view: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
        },
        categories: { view: true, create: true, update: true, delete: true },
        locations: { view: true, create: true, update: true, delete: true },
        bookings: { view: true, update: false, delete: false },
        comments: { view: true, update: true, delete: true },
        posts: {
          view: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
        },
      }),
      lastLoginAt: null,
      otp: null,
      otpExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. User Admin (focus on user management)
    admins.push({
      adminId,
      name: 'User Admin',
      email: 'useradmin@example.com',
      password: defaultPassword,
      phone: '+1234567892',
      profileImage: null,
      status: 'active',
      permissions: JSON.stringify({
        users: { view: true, create: true, update: true, delete: true },
        moderators: { view: true, create: true, update: true, delete: true },
        places: {
          view: true,
          create: false,
          update: false,
          delete: false,
          approve: false,
        },
        categories: { view: true, create: false, update: false, delete: false },
        locations: { view: true, create: false, update: false, delete: false },
        bookings: { view: true, update: true, delete: true },
        comments: { view: true, update: false, delete: false },
        posts: {
          view: false,
          create: false,
          update: false,
          delete: false,
          approve: false,
        },
      }),
      lastLoginAt: null,
      otp: null,
      otpExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 4. Regional Admin (for Europe region)
    admins.push({
      adminId,
      name: 'Europe Admin',
      email: 'europe@example.com',
      password: defaultPassword,
      phone: '+1234567893',
      profileImage: null,
      status: 'active',
      permissions: JSON.stringify({
        users: { view: true, create: true, update: true, delete: false },
        moderators: { view: true, create: true, update: true, delete: false },
        places: {
          view: true,
          create: true,
          update: true,
          delete: true,
          approve: true,
        },
        categories: { view: true, create: false, update: false, delete: false },
        locations: { view: true, create: true, update: true, delete: false },
        bookings: { view: true, update: true, delete: false },
        comments: { view: true, update: true, delete: true },
        posts: {
          view: true,
          create: true,
          update: true,
          delete: false,
          approve: true,
        },
      }),
      lastLoginAt: null,
      otp: null,
      otpExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 5. Inactive Admin (for testing inactive status)
    admins.push({
      adminId,
      name: 'Inactive Admin',
      email: 'inactive@example.com',
      password: defaultPassword,
      phone: '+1234567894',
      profileImage: null,
      status: 'inactive',
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
      lastLoginAt: null,
      otp: null,
      otpExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert all admins
    await queryInterface.bulkInsert('Admins', admins);

    console.log('Admin seed data created:');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', {
      email: {
        [Sequelize.Op.in]: [
          'superadmin@example.com',
          'content@example.com',
          'useradmin@example.com',
          'europe@example.com',
          'inactive@example.com',
        ],
      },
    });
  },
};
