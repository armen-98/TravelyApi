'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const now = new Date();

      // Step 1: Create country location categories
      console.log('Creating country location categories...');
      const countries = [
        {
          title: 'United States',
          count: 120,
          icon: 'flag',
          color: '#2196F3',
          type: 'location',
          hasChild: true,
          parentId: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'United Kingdom',
          count: 85,
          icon: 'flag',
          color: '#E91E63',
          type: 'location',
          hasChild: true,
          parentId: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Canada',
          count: 65,
          icon: 'flag',
          color: '#F44336',
          type: 'location',
          hasChild: true,
          parentId: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Australia',
          count: 50,
          icon: 'flag',
          color: '#4CAF50',
          type: 'location',
          hasChild: true,
          parentId: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Germany',
          count: 75,
          icon: 'flag',
          color: '#FFC107',
          type: 'location',
          hasChild: true,
          parentId: null,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const countryCategories = await queryInterface.bulkInsert(
        'Categories',
        countries,
        { returning: true },
      );

      // Step 2: Create images for country categories
      console.log('Creating images for country categories...');
      const countryImages = countryCategories.map((country) => {
        const slug = country.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        return {
          full: `https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/1708063049157-NMFAB7KBRBY2IG2BWP4E/the+golden+gate+bridge+san+francisco.jpg`,
          thumb: `https://images.squarespace-cdn.com/content/v1/5c7f5f60797f746a7d769cab/1708063049157-NMFAB7KBRBY2IG2BWP4E/the+golden+gate+bridge+san+francisco.jpg`,
          categoryId: country.id,
          createdAt: now,
          updatedAt: now,
        };
      });

      const insertedCountryImages = await queryInterface.bulkInsert(
        'Images',
        countryImages,
        { returning: true },
      );

      // Step 3: Update country categories with image IDs
      console.log('Updating country categories with image IDs...');
      for (let i = 0; i < countryCategories.length; i++) {
        await queryInterface.sequelize.query(
          `UPDATE "Categories"
             SET "imageId" = ${insertedCountryImages[i].id}
             WHERE id = ${countryCategories[i].id}`,
        );
      }

      // Step 4: Create state/province location categories
      console.log('Creating state/province location categories...');
      const states = [
        // United States
        {
          title: 'California',
          count: 45,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[0].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'New York',
          count: 38,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[0].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Texas',
          count: 30,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[0].id,
          createdAt: now,
          updatedAt: now,
        },
        // United Kingdom
        {
          title: 'England',
          count: 40,
          icon: 'map-pin',
          color: '#E91E63',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[1].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Scotland',
          count: 25,
          icon: 'map-pin',
          color: '#E91E63',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[1].id,
          createdAt: now,
          updatedAt: now,
        },
        // Canada
        {
          title: 'Ontario',
          count: 30,
          icon: 'map-pin',
          color: '#F44336',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[2].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'British Columbia',
          count: 20,
          icon: 'map-pin',
          color: '#F44336',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[2].id,
          createdAt: now,
          updatedAt: now,
        },
        // Australia
        {
          title: 'New South Wales',
          count: 22,
          icon: 'map-pin',
          color: '#4CAF50',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[3].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Victoria',
          count: 18,
          icon: 'map-pin',
          color: '#4CAF50',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[3].id,
          createdAt: now,
          updatedAt: now,
        },
        // Germany
        {
          title: 'Bavaria',
          count: 28,
          icon: 'map-pin',
          color: '#FFC107',
          type: 'location',
          hasChild: true,
          parentId: countryCategories[4].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Berlin',
          count: 22,
          icon: 'map-pin',
          color: '#FFC107',
          type: 'location',
          hasChild: false,
          parentId: countryCategories[4].id,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const stateCategories = await queryInterface.bulkInsert(
        'Categories',
        states,
        { returning: true },
      );

      // Step 5: Create images for state categories
      console.log('Creating images for state categories...');
      const stateImages = stateCategories.map((state) => {
        const slug = state.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        return {
          full: `https://www.travelandleisure.com/thmb/A1OjGJeUKI8BmCK6NDSkK54MeZU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-golden-gate-bridge-san-fran-recirc-SFTAX24-fdb8ae50631b4090afd3be35607cb6b6.jpg`,
          thumb: `https://www.travelandleisure.com/thmb/A1OjGJeUKI8BmCK6NDSkK54MeZU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-golden-gate-bridge-san-fran-recirc-SFTAX24-fdb8ae50631b4090afd3be35607cb6b6.jpg`,
          categoryId: state.id,
          createdAt: now,
          updatedAt: now,
        };
      });

      const insertedStateImages = await queryInterface.bulkInsert(
        'Images',
        stateImages,
        { returning: true },
      );

      // Step 6: Update state categories with image IDs
      console.log('Updating state categories with image IDs...');
      for (let i = 0; i < stateCategories.length; i++) {
        await queryInterface.sequelize.query(
          `UPDATE "Categories"
             SET "imageId" = ${insertedStateImages[i].id}
             WHERE id = ${stateCategories[i].id}`,
        );
      }

      // Step 7: Create city location categories
      console.log('Creating city location categories...');
      const cities = [
        // California
        {
          title: 'Los Angeles',
          count: 25,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[0].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'San Francisco',
          count: 20,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[0].id,
          createdAt: now,
          updatedAt: now,
        },
        // New York
        {
          title: 'New York City',
          count: 30,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[1].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Buffalo',
          count: 8,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[1].id,
          createdAt: now,
          updatedAt: now,
        },
        // Texas
        {
          title: 'Houston',
          count: 18,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[2].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Austin',
          count: 12,
          icon: 'map-pin',
          color: '#2196F3',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[2].id,
          createdAt: now,
          updatedAt: now,
        },
        // England
        {
          title: 'London',
          count: 35,
          icon: 'map-pin',
          color: '#E91E63',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[3].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Manchester',
          count: 15,
          icon: 'map-pin',
          color: '#E91E63',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[3].id,
          createdAt: now,
          updatedAt: now,
        },
        // Scotland
        {
          title: 'Edinburgh',
          count: 18,
          icon: 'map-pin',
          color: '#E91E63',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[4].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Glasgow',
          count: 12,
          icon: 'map-pin',
          color: '#E91E63',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[4].id,
          createdAt: now,
          updatedAt: now,
        },
        // Ontario
        {
          title: 'Toronto',
          count: 22,
          icon: 'map-pin',
          color: '#F44336',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[5].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Ottawa',
          count: 15,
          icon: 'map-pin',
          color: '#F44336',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[5].id,
          createdAt: now,
          updatedAt: now,
        },
        // British Columbia
        {
          title: 'Vancouver',
          count: 18,
          icon: 'map-pin',
          color: '#F44336',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[6].id,
          createdAt: now,
          updatedAt: now,
        },
        {
          title: 'Victoria',
          count: 8,
          icon: 'map-pin',
          color: '#F44336',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[6].id,
          createdAt: now,
          updatedAt: now,
        },
        // New South Wales
        {
          title: 'Sydney',
          count: 20,
          icon: 'map-pin',
          color: '#4CAF50',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[7].id,
          createdAt: now,
          updatedAt: now,
        },
        // Victoria (Australia)
        {
          title: 'Melbourne',
          count: 16,
          icon: 'map-pin',
          color: '#4CAF50',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[8].id,
          createdAt: now,
          updatedAt: now,
        },
        // Bavaria
        {
          title: 'Munich',
          count: 22,
          icon: 'map-pin',
          color: '#FFC107',
          type: 'location',
          hasChild: false,
          parentId: stateCategories[9].id,
          createdAt: now,
          updatedAt: now,
        },
      ];

      const cityCategories = await queryInterface.bulkInsert(
        'Categories',
        cities,
        { returning: true },
      );

      // Step 8: Create images for city categories
      console.log('Creating images for city categories...');
      const cityImages = cityCategories.map((city) => {
        const slug = city.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        return {
          full: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7j3jISbOdT8Lsw8r65yOcSj8GL4JpPgYJhw&s`,
          thumb: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7j3jISbOdT8Lsw8r65yOcSj8GL4JpPgYJhw&s`,
          categoryId: city.id,
          createdAt: now,
          updatedAt: now,
        };
      });

      const insertedCityImages = await queryInterface.bulkInsert(
        'Images',
        cityImages,
        { returning: true },
      );

      // Step 9: Update city categories with image IDs
      console.log('Updating city categories with image IDs...');
      for (let i = 0; i < cityCategories.length; i++) {
        await queryInterface.sequelize.query(
          `UPDATE "Categories"
             SET "imageId" = ${insertedCityImages[i].id}
             WHERE id = ${cityCategories[i].id}`,
        );
      }

      console.log('Successfully created location categories with images');
      return;
    } catch (error) {
      console.error('Error in location categories seeder:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Step 1: Get all categories with type location
      const locationCategories = await queryInterface.sequelize.query(
        `SELECT id, "imageId"
           FROM "Categories"
           WHERE type = 'location'`,
        { type: Sequelize.QueryTypes.SELECT },
      );

      if (locationCategories.length === 0) {
        return;
      }

      // Step 2: Get all image IDs
      const imageIds = locationCategories
        .map((cat) => cat.imageId)
        .filter((id) => id !== null);

      // Step 3: Delete all location categories
      await queryInterface.bulkDelete('Categories', {
        type: 'location',
      });

      // Step 4: Delete all associated images
      if (imageIds.length > 0) {
        await queryInterface.bulkDelete('Images', {
          id: { [Sequelize.Op.in]: imageIds },
        });
      }

      console.log('Successfully removed location categories and their images');
      return;
    } catch (error) {
      console.error('Error in location categories seeder down method:', error);
      throw error;
    }
  },
};
