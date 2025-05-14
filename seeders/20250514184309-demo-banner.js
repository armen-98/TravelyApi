'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const widgets = await queryInterface.sequelize.query(
      `SELECT id FROM "Widgets" WHERE type IN ('slider', 'banner')`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    if (widgets.length === 0) {
      await queryInterface.bulkInsert('Widgets', [
        {
          title: 'Home Slider',
          description: 'Main slider for the home page',
          type: 'slider',
          direction: 'horizontal',
          layout: 'fullwidth',
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const newWidgets = await queryInterface.sequelize.query(
        `SELECT id FROM "Widgets" WHERE type = 'slider'`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      widgets.push(...newWidgets);
    }

    const banners = [];

    for (const widget of widgets) {
      for (let i = 1; i <= 3; i++) {
        banners.push({
          type: 'slider',
          link: `https://example.com/promotion/${i}`,
          widgetId: widget.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('Banners', banners);

    const createdBanners = await queryInterface.sequelize.query(
      `SELECT id FROM "Banners" WHERE type = 'slider' ORDER BY id DESC LIMIT ?`,
      {
        replacements: [banners.length],
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    const imageUrls = [
      'https://www.shutterstock.com/image-photo/maldives-paradise-scenery-tropical-aerial-600nw-1901686090.jpg',
      'https://media.istockphoto.com/id/518356812/photo/tropical-sea-and-rocks.jpg?s=612x612&w=0&k=20&c=bRAfkVsQ-d5wQjYiRWupDBThGr1Zn7aEP98VWFaxBy8=',
      'https://media.istockphoto.com/id/698900018/photo/world-landmarks-photo-collage-isolated-on-white-background-travel-tourism-and-study-around-the.jpg?s=612x612&w=0&k=20&c=0jW092ZfCtAbjM-qVpdKdYwCW17S0AJe0vwOqvzExe0=',
    ];

    const images = [];

    for (let i = 0; i < createdBanners.length; i++) {
      const banner = createdBanners[i];
      const index = i % 3;

      images.push({
        full: imageUrls[index],
        thumb: imageUrls[index],
        bannerId: banner.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    if (images.length > 0) {
      await queryInterface.bulkInsert('Images', images);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const banners = await queryInterface.sequelize.query(
      `SELECT id FROM "Banners" WHERE type = 'slider'`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      },
    );

    const bannerIds = banners.map((banner) => banner.id);

    if (bannerIds.length > 0) {
      await queryInterface.bulkDelete('Images', {
        bannerId: {
          [Sequelize.Op.in]: bannerIds,
        },
      });
    }

    await queryInterface.bulkDelete('Banners', {
      type: 'slider',
    });
  },
};
