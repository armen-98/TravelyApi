module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Settings', [
      {
        layout: 'basic',
        useLayoutWidget: true,
        perPage: 20,
        listMode: 'list',
        enableSubmit: true,
        minPrice: 0.0,
        maxPrice: 1000.0,
        colors: JSON.stringify([
          '#FF5722',
          '#2196F3',
          '#4CAF50',
          '#9C27B0',
          '#E91E63',
          '#03A9F4',
          '#607D8B',
          '#795548',
          '#FF9800',
        ]),
        unit: 'USD',
        startHour: '08:00',
        endHour: '18:00',
        useViewAddress: true,
        useViewPhone: true,
        useViewFax: true,
        useViewEmail: true,
        useViewWebsite: true,
        useViewSocial: true,
        useViewStatus: true,
        useViewDateEstablish: true,
        useViewGalleries: true,
        useViewAttachment: true,
        useViewVideo: true,
        useViewMap: true,
        useViewPrice: true,
        useViewOpenHours: true,
        useViewTags: true,
        useViewFeature: true,
        useViewAdmob: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Settings', null, {});
  },
};
