const { faker } = require('@faker-js/faker');
const slugify = require('slugify');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('Starting product seeder...');

      // Get all categories
      const categories = await queryInterface.sequelize.query(
        `SELECT * FROM "Categories"`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      // Get parent-child relationships for categories
      const categoryRelationships = await queryInterface.sequelize.query(
        `SELECT * FROM "Categories" WHERE "parentId" IS NOT NULL`,
        { type: queryInterface.sequelize.QueryTypes.SELECT },
      );

      // Create a map of parent categories to their subcategories
      const categoryMap = {};
      categories.forEach((category) => {
        categoryMap[category.id] = {
          ...category,
          subcategories: [],
        };
      });

      categoryRelationships.forEach((subcat) => {
        if (categoryMap[subcat.parentId]) {
          categoryMap[subcat.parentId].subcategories.push(subcat);
        }
      });

      // Get all users for random author assignment
      const users = await queryInterface.sequelize.query(
        `SELECT * FROM "Users"`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      // Get locations for assignment
      const countries = await queryInterface.sequelize.query(
        `SELECT * FROM "Locations" WHERE "type" = 'country'`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      const states = await queryInterface.sequelize.query(
        `SELECT * FROM "Locations" WHERE "type" = 'state'`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      const cities = await queryInterface.sequelize.query(
        `SELECT * FROM "Locations" WHERE "type" = 'city'`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      // Get tags for assignment
      const tags = await queryInterface.sequelize.query(
        `SELECT * FROM "Tags"`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      // Get facilities for assignment
      const facilities = await queryInterface.sequelize.query(
        `SELECT * FROM "Facilities"`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
        },
      );

      // Process each category
      for (const categoryId in categoryMap) {
        const category = categoryMap[categoryId];
        if (!category.parentId) {
          // Only process parent categories here
          console.log(`Creating products for category: ${category.title}`);

          // Create 5 products for this category
          for (let i = 0; i < 5; i++) {
            await createProductForCategory(
              queryInterface,
              Sequelize,
              category,
              users,
              countries,
              states,
              cities,
              tags,
              facilities,
              i,
            );
          }

          // Also create 5 products for each subcategory
          if (category.subcategories && category.subcategories.length > 0) {
            for (const subcategory of category.subcategories) {
              console.log(
                `Creating products for subcategory: ${subcategory.title}`,
              );

              for (let i = 0; i < 5; i++) {
                await createProductForCategory(
                  queryInterface,
                  Sequelize,
                  subcategory,
                  users,
                  countries,
                  states,
                  cities,
                  tags,
                  facilities,
                  i,
                );
              }
            }
          }
        }
      }

      console.log('Product seeder completed successfully!');
      return Promise.resolve();
    } catch (error) {
      console.error('Error in product seeder:', error);
      return Promise.reject(error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Delete all products and related data
      await queryInterface.bulkDelete('TimeSlots', null, {});
      await queryInterface.bulkDelete('WorkingSchedules', null, {});
      await queryInterface.bulkDelete('Schedules', null, {});
      await queryInterface.bulkDelete('OpenTimes', null, {});
      await queryInterface.bulkDelete('ProductSocialNetworks', null, {});
      await queryInterface.bulkDelete('ProductFacilities', null, {});
      await queryInterface.bulkDelete('ProductTags', null, {});
      await queryInterface.bulkDelete(
        'Images',
        { productId: { [Sequelize.Op.not]: null } },
        {},
      );
      await queryInterface.bulkDelete('Products', null, {});

      return Promise.resolve();
    } catch (error) {
      console.error('Error in product seeder down migration:', error);
      return Promise.reject(error);
    }
  },
};

async function createProductForCategory(
  queryInterface,
  Sequelize,
  category,
  users,
  countries,
  states,
  cities,
  tags,
  facilities,
  index,
) {
  try {
    // Select random items for relationships
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCountry =
      countries[Math.floor(Math.random() * countries.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    // Generate product data based on category type
    const productData = generateProductData(category, index);

    // Create the product
    const [product] = await queryInterface.sequelize.query(
      `INSERT INTO "Products" (
        title, description, address, "zipCode", phone, fax, email, website,
        "priceMin", "priceMax", "priceDisplay", "dateEstablish", status, "useClaim",
        "claimVerified", rate, "numRate", "rateText", longitude, latitude,
        "authorId", "categoryId", "countryId", "stateId", "cityId", "bookingStyle",
        "videoURL", color, icon, link, "createdAt", "updatedAt"
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, NOW(), NOW()
      ) RETURNING id`,
      {
        replacements: [
          productData.title,
          productData.description,
          productData.address,
          productData.zipCode,
          productData.phone,
          productData.fax,
          productData.email,
          productData.website,
          productData.priceMin,
          productData.priceMax,
          productData.priceDisplay,
          productData.dateEstablish,
          'publish',
          true,
          Math.random() > 0.7, // 30% are verified
          (Math.random() * 5).toFixed(1),
          Math.floor(Math.random() * 500),
          generateRatingText((Math.random() * 5).toFixed(1)),
          productData.longitude,
          productData.latitude,
          randomUser.id,
          category.id,
          randomCountry.id,
          randomState.id,
          randomCity.id,
          productData.bookingStyle,
          productData.videoURL,
          productData.color,
          productData.icon,
          slugify(productData.title, { lower: true }),
        ],
        type: queryInterface.sequelize.QueryTypes.INSERT,
      },
    );

    const productId = product[0].id;

    // Create main image for the product
    const [mainImage] = await queryInterface.sequelize.query(
      `INSERT INTO "Images" (
        "full", "thumb", "productId", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, NOW(), NOW()) RETURNING id`,
      {
        replacements: [
          productData.mainImage.full,
          productData.mainImage.thumb,
          productId,
        ],
        type: queryInterface.sequelize.QueryTypes.INSERT,
      },
    );

    const mainImageId = mainImage[0].id;

    // Update product with main image
    await queryInterface.sequelize.query(
      `UPDATE "Products" SET "imageId" = ? WHERE "id" = ?`,
      {
        replacements: [mainImageId, productId],
        type: queryInterface.sequelize.QueryTypes.UPDATE,
      },
    );

    // Create gallery images (3-6 images)
    const galleryCount = Math.floor(Math.random() * 4) + 3; // 3-6 images
    for (let i = 0; i < galleryCount; i++) {
      await queryInterface.sequelize.query(
        `INSERT INTO "Images" (
          "full", "thumb", "productId", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, NOW(), NOW())`,
        {
          replacements: [
            productData.galleryImages[i].full,
            productData.galleryImages[i].thumb,
            productId,
          ],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        },
      );
    }

    // Assign random tags (2-5 tags)
    const tagCount = Math.floor(Math.random() * 4) + 2; // 2-5 tags
    const selectedTags = getRandomItems(tags, tagCount);
    for (const tag of selectedTags) {
      await queryInterface.sequelize.query(
        `INSERT INTO "ProductTags" ("productId", "tagId", "createdAt", "updatedAt") 
         VALUES (?, ?, NOW(), NOW())`,
        {
          replacements: [productId, tag.id],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        },
      );
    }

    // Assign random facilities (3-8 facilities)
    const facilityCount = Math.floor(Math.random() * 6) + 3; // 3-8 facilities
    const selectedFacilities = getRandomItems(facilities, facilityCount);
    for (const facility of selectedFacilities) {
      await queryInterface.sequelize.query(
        `INSERT INTO "ProductFacilities" ("productId", "facilityId", "createdAt", "updatedAt") 
         VALUES (?, ?, NOW(), NOW())`,
        {
          replacements: [productId, facility.id],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        },
      );
    }

    // Create working schedules for each day of the week
    for (let day = 0; day < 7; day++) {
      const isWeekend = day === 0 || day === 6; // Sunday or Saturday
      const isClosed = isWeekend ? Math.random() > 0.7 : Math.random() > 0.9; // More likely closed on weekends
      const openAllDay = Math.random() > 0.9; // 10% are open 24 hours

      const [workingSchedule] = await queryInterface.sequelize.query(
        `INSERT INTO "WorkingSchedules" (
          "productId", "dayOfWeek", "isOpen", "openAllDay", "isClosed", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, ?, ?, NOW(), NOW()) RETURNING id`,
        {
          replacements: [productId, day, !isClosed, openAllDay, isClosed],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        },
      );

      const scheduleId = workingSchedule[0].id;

      // If not closed and not open all day, create time slots
      if (!isClosed && !openAllDay) {
        // Create 1-3 time slots (e.g., morning, afternoon, evening)
        const slotCount = Math.floor(Math.random() * 3) + 1;

        if (slotCount === 1) {
          // Single time slot (e.g., 9 AM - 5 PM)
          await queryInterface.sequelize.query(
            `INSERT INTO "TimeSlots" (
              "scheduleId", "startTime", "endTime", "label", "createdAt", "updatedAt"
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [
                scheduleId,
                '09:00:00',
                '17:00:00',
                'Business Hours',
              ],
              type: queryInterface.sequelize.QueryTypes.INSERT,
            },
          );
        } else if (slotCount === 2) {
          // Two time slots (e.g., morning and afternoon)
          await queryInterface.sequelize.query(
            `INSERT INTO "TimeSlots" (
              "scheduleId", "startTime", "endTime", "label", "createdAt", "updatedAt"
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [
                scheduleId,
                '08:30:00',
                '12:30:00',
                'Morning Hours',
              ],
              type: queryInterface.sequelize.QueryTypes.INSERT,
            },
          );

          await queryInterface.sequelize.query(
            `INSERT INTO "TimeSlots" (
              "scheduleId", "startTime", "endTime", "label", "createdAt", "updatedAt"
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [
                scheduleId,
                '13:30:00',
                '18:00:00',
                'Afternoon Hours',
              ],
              type: queryInterface.sequelize.QueryTypes.INSERT,
            },
          );
        } else {
          // Three time slots (e.g., morning, afternoon, evening)
          await queryInterface.sequelize.query(
            `INSERT INTO "TimeSlots" (
              "scheduleId", "startTime", "endTime", "label", "createdAt", "updatedAt"
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [scheduleId, '08:00:00', '12:00:00', 'Morning'],
              type: queryInterface.sequelize.QueryTypes.INSERT,
            },
          );

          await queryInterface.sequelize.query(
            `INSERT INTO "TimeSlots" (
              "scheduleId", "startTime", "endTime", "label", "createdAt", "updatedAt"
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [scheduleId, '12:30:00', '16:30:00', 'Afternoon'],
              type: queryInterface.sequelize.QueryTypes.INSERT,
            },
          );

          await queryInterface.sequelize.query(
            `INSERT INTO "TimeSlots" (
              "scheduleId", "startTime", "endTime", "label", "createdAt", "updatedAt"
            ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [scheduleId, '17:30:00', '22:00:00', 'Evening'],
              type: queryInterface.sequelize.QueryTypes.INSERT,
            },
          );
        }
      }
    }

    // Create open times and schedules (legacy format)
    for (let day = 0; day < 7; day++) {
      const [openTime] = await queryInterface.sequelize.query(
        `INSERT INTO "OpenTimes" (
          "dayOfWeek", "key", "productId", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, NOW(), NOW()) RETURNING id`,
        {
          replacements: [day, getDayKey(day), productId],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        },
      );

      const openTimeId = openTime[0].id;

      // Create schedules for this open time
      await queryInterface.sequelize.query(
        `INSERT INTO "Schedules" (
          "view", "start", "end", "openTimeId", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        {
          replacements: ['Open', '09:00', '18:00', openTimeId],
          type: queryInterface.sequelize.QueryTypes.INSERT,
        },
      );
    }

    return productId;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

function generateProductData(category, index) {
  // Base data that's common for all products
  const baseData = {
    address: faker.location.streetAddress(),
    zipCode: faker.location.zipCode(),
    phone: faker.phone.number(),
    fax: faker.phone.number(),
    email: faker.internet.email(),
    website: faker.internet.url(),
    dateEstablish: faker.date.past({ years: 10 }),
    longitude: Number.parseFloat(faker.location.longitude()),
    latitude: Number.parseFloat(faker.location.latitude()),
    bookingStyle: getRandomBookingStyle(),
    videoURL:
      Math.random() > 0.7
        ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        : null,
    color: faker.color.rgb(),
    icon: getRandomIcon(),
    galleryImages: generateGalleryImages(category.title, index),
  };

  // Determine the category type
  let categoryType = 'general';
  const categoryTitle = category.title.toLowerCase();

  if (
    categoryTitle.includes('restaurant') ||
    categoryTitle.includes('food') ||
    categoryTitle.includes('cafe') ||
    categoryTitle.includes('dining')
  ) {
    categoryType = 'restaurant';
  } else if (
    categoryTitle.includes('hotel') ||
    categoryTitle.includes('accommodation') ||
    categoryTitle.includes('resort') ||
    categoryTitle.includes('stay')
  ) {
    categoryType = 'hotel';
  } else if (
    categoryTitle.includes('shop') ||
    categoryTitle.includes('store') ||
    categoryTitle.includes('mall') ||
    categoryTitle.includes('market')
  ) {
    categoryType = 'shopping';
  } else if (
    categoryTitle.includes('entertainment') ||
    categoryTitle.includes('theater') ||
    categoryTitle.includes('cinema') ||
    categoryTitle.includes('park')
  ) {
    categoryType = 'entertainment';
  }

  // Generate specific data based on category type
  switch (categoryType) {
    case 'restaurant':
      return {
        ...baseData,
        title: generateRestaurantName(index),
        description: generateRestaurantDescription(),
        priceMin: (Math.random() * 10 + 5).toFixed(2),
        priceMax: (Math.random() * 50 + 20).toFixed(2),
        priceDisplay: '$$ - $$$',
        mainImage: {
          full: `https://media.admiddleeast.com/photos/66a8cd5c062b8b3a02f9430c/16:9/w_2560%2Cc_limit/abu-dhabi-broadway-interior-seating.jpeg`,
          thumb: `https://media.admiddleeast.com/photos/66a8cd5c062b8b3a02f9430c/16:9/w_2560%2Cc_limit/abu-dhabi-broadway-interior-seating.jpeg`,
        },
      };

    case 'hotel':
      return {
        ...baseData,
        title: generateHotelName(index),
        description: generateHotelDescription(),
        priceMin: (Math.random() * 50 + 50).toFixed(2),
        priceMax: (Math.random() * 200 + 100).toFixed(2),
        priceDisplay: '$$ - $$$$',
        mainImage: {
          full: `https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg?cs=srgb&dl=pexels-jimbear-1458457.jpg&fm=jpg`,
          thumb: `https://images.pexels.com/photos/1458457/pexels-photo-1458457.jpeg?cs=srgb&dl=pexels-jimbear-1458457.jpg&fm=jpg`,
        },
      };

    case 'shopping':
      return {
        ...baseData,
        title: generateShopName(index),
        description: generateShopDescription(),
        priceMin: (Math.random() * 20 + 5).toFixed(2),
        priceMax: (Math.random() * 100 + 50).toFixed(2),
        priceDisplay: '$ - $$$',
        mainImage: {
          full: `https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?semt=ais_hybrid&w=740`,
          thumb: `https://img.freepik.com/free-photo/black-friday-elements-assortment_23-2149074075.jpg?semt=ais_hybrid&w=740`,
        },
      };

    case 'entertainment':
      return {
        ...baseData,
        title: generateEntertainmentName(index),
        description: generateEntertainmentDescription(),
        priceMin: (Math.random() * 15 + 5).toFixed(2),
        priceMax: (Math.random() * 50 + 20).toFixed(2),
        priceDisplay: '$ - $$',
        mainImage: {
          full: `https://burst.shopifycdn.com/photos/dj-crowd.jpg?width=1000&format=pjpg&exif=0&iptc=0`,
          thumb: `https://burst.shopifycdn.com/photos/dj-crowd.jpg?width=1000&format=pjpg&exif=0&iptc=0`,
        },
      };

    default:
      return {
        ...baseData,
        title: generateGeneralName(category.title, index),
        description: generateGeneralDescription(category.title),
        priceMin: (Math.random() * 20 + 5).toFixed(2),
        priceMax: (Math.random() * 100 + 30).toFixed(2),
        priceDisplay: '$ - $$$',
        mainImage: {
          full: `https://surfsideonthelake.com/wp-content/uploads/2022/02/Lake-George-Spa.jpg`,
          thumb: `https://surfsideonthelake.com/wp-content/uploads/2022/02/Lake-George-Spa.jpg`,
        },
      };
  }
}

function generateGalleryImages(categoryTitle) {
  const images = [];

  // Generate 6 gallery images (we'll use a subset of these)
  for (let i = 1; i <= 6; i++) {
    images.push({
      full: `https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
      thumb: `https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500`,
    });
  }

  return images;
}

function getCategoryType(categoryTitle) {
  const title = categoryTitle.toLowerCase();

  if (
    title.includes('restaurant') ||
    title.includes('food') ||
    title.includes('cafe') ||
    title.includes('dining')
  ) {
    return 'restaurants';
  } else if (
    title.includes('hotel') ||
    title.includes('accommodation') ||
    title.includes('resort') ||
    title.includes('stay')
  ) {
    return 'hotels';
  } else if (
    title.includes('shop') ||
    title.includes('store') ||
    title.includes('mall') ||
    title.includes('market')
  ) {
    return 'shopping';
  } else if (
    title.includes('entertainment') ||
    title.includes('theater') ||
    title.includes('cinema') ||
    title.includes('park')
  ) {
    return 'entertainment';
  } else {
    return 'general';
  }
}

function generateRestaurantName(index) {
  const prefixes = [
    'The',
    'Le',
    'La',
    '',
    'Royal',
    'Golden',
    'Silver',
    'Blue',
    'Green',
    'Red',
  ];
  const names = [
    'Bistro',
    'Grill',
    'Kitchen',
    'Table',
    'Spoon',
    'Fork',
    'Plate',
    'Cuisine',
    'Taste',
    'Flavor',
  ];
  const suffixes = [
    'House',
    'Restaurant',
    'Eatery',
    'Diner',
    'Café',
    'Brasserie',
    'Trattoria',
    'Osteria',
    'Tavern',
    '',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Ensure uniqueness by adding index
  return `${prefix} ${name} ${suffix} ${index + 1}`.trim();
}

function generateHotelName(index) {
  const prefixes = [
    'Grand',
    'Royal',
    'The',
    'Luxury',
    'Premium',
    'Elite',
    'Comfort',
    'Cozy',
    'Modern',
    'Classic',
  ];
  const names = [
    'Plaza',
    'Suites',
    'Inn',
    'Resort',
    'Hotel',
    'Residency',
    'Palace',
    'Towers',
    'Lodge',
    'Retreat',
  ];
  const suffixes = [
    '& Spa',
    'International',
    'Boutique',
    'Deluxe',
    'Premium',
    '',
    '& Resort',
    'Luxury',
    'Exclusive',
    '',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Ensure uniqueness by adding index
  return `${prefix} ${name} ${suffix} ${index + 1}`.trim();
}

function generateShopName(index) {
  const prefixes = [
    'The',
    'Modern',
    'Urban',
    'City',
    'Metro',
    'Trendy',
    'Chic',
    'Elite',
    'Premium',
    'Classic',
  ];
  const names = [
    'Shop',
    'Store',
    'Boutique',
    'Emporium',
    'Market',
    'Bazaar',
    'Gallery',
    'Outlet',
    'Collection',
    'Corner',
  ];
  const suffixes = [
    'Center',
    'Place',
    'Hub',
    'Zone',
    'Spot',
    'Avenue',
    'Square',
    'Point',
    'District',
    '',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Ensure uniqueness by adding index
  return `${prefix} ${name} ${suffix} ${index + 1}`.trim();
}

function generateEntertainmentName(index) {
  const prefixes = [
    'The',
    'Amazing',
    'Fantastic',
    'Exciting',
    'Fun',
    'Thrilling',
    'Epic',
    'Grand',
    'Mega',
    'Super',
  ];
  const names = [
    'Cinema',
    'Theater',
    'Arcade',
    'Park',
    'Arena',
    'Stadium',
    'Center',
    'Zone',
    'World',
    'Land',
  ];
  const suffixes = [
    'Entertainment',
    'Amusement',
    'Adventure',
    'Experience',
    'Fun',
    'Joy',
    'Thrill',
    'Excitement',
    'Wonder',
    '',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Ensure uniqueness by adding index
  return `${prefix} ${name} ${suffix} ${index + 1}`.trim();
}

function generateGeneralName(categoryTitle, index) {
  return `${categoryTitle} Listing ${index + 1}`;
}

function generateRestaurantDescription() {
  const intro = [
    'A culinary gem offering exquisite flavors and a warm atmosphere.',
    'Discover a gastronomic paradise where every dish tells a story.',
    'An elegant dining establishment known for its exceptional cuisine and impeccable service.',
    'A charming eatery that combines traditional recipes with modern culinary techniques.',
    'Experience fine dining in a relaxed and inviting environment.',
  ];

  const cuisine = [
    'Our menu features a diverse selection of international dishes prepared with locally sourced ingredients.',
    'We specialize in authentic regional cuisine with a contemporary twist.',
    'Our chef creates seasonal menus that highlight the freshest ingredients available.',
    'From farm to table, we pride ourselves on using only the highest quality organic produce.',
    'Our signature dishes blend traditional flavors with innovative cooking methods.',
  ];

  const experience = [
    'The elegant dining room provides the perfect setting for both intimate dinners and celebratory gatherings.',
    'Our outdoor terrace offers a delightful al fresco dining experience during warmer months.',
    'The sophisticated bar serves craft cocktails and an extensive selection of fine wines.',
    'Private dining rooms are available for special events and corporate functions.',
    'Live music on weekends enhances the already vibrant atmosphere.',
  ];

  const conclusion = [
    'Reservations are recommended, especially for weekend dining.',
    'Our friendly staff looks forward to providing you with an unforgettable dining experience.',
    'We cater to dietary restrictions and offer vegetarian, vegan, and gluten-free options.',
    'Join us for happy hour specials and tasting events throughout the year.',
    'Gift certificates are available for purchase, making the perfect present for food enthusiasts.',
  ];

  return `${getRandomItem(intro)} ${getRandomItem(cuisine)} ${getRandomItem(experience)} ${getRandomItem(conclusion)}`;
}

function generateHotelDescription() {
  const intro = [
    'A luxurious retreat offering exceptional comfort and world-class amenities.',
    'Experience unparalleled hospitality in our elegantly appointed accommodations.',
    'A premier destination combining sophisticated style with modern convenience.',
    'Discover a tranquil oasis where every detail is designed for your relaxation and enjoyment.',
    'An exclusive property that sets new standards for luxury and service.',
  ];

  const rooms = [
    'Our spacious rooms and suites feature premium bedding, state-of-the-art technology, and stunning views.',
    'Each accommodation is thoughtfully designed with contemporary furnishings and luxurious touches.',
    "From cozy standard rooms to expansive suites, we offer options to suit every traveler's needs.",
    'All rooms include complimentary high-speed WiFi, flat-screen TVs, and elegant marble bathrooms.',
    'Our signature suites provide separate living areas, private balconies, and exclusive amenities.',
  ];

  const amenities = [
    'Guests can enjoy our fitness center, spa facilities, and temperature-controlled swimming pool.',
    'Our property features multiple dining options, from casual cafés to fine dining restaurants.',
    'Business travelers appreciate our well-equipped meeting rooms and comprehensive business center.',
    'The concierge team is available 24/7 to assist with travel arrangements and local recommendations.',
    'Complimentary shuttle service is provided to nearby attractions and transportation hubs.',
  ];

  const conclusion = [
    'Whether traveling for business or leisure, we promise an exceptional stay that exceeds expectations.',
    'Our dedicated staff is committed to ensuring every aspect of your visit is perfect.',
    'Special packages are available for romantic getaways, family vacations, and extended stays.',
    'Join our loyalty program to enjoy exclusive benefits and preferential rates on future visits.',
    'We look forward to welcoming you and creating memorable experiences during your stay.',
  ];

  return `${getRandomItem(intro)} ${getRandomItem(rooms)} ${getRandomItem(amenities)} ${getRandomItem(conclusion)}`;
}

function generateShopDescription() {
  const intro = [
    'A premier shopping destination offering a curated selection of high-quality merchandise.',
    'Discover a retail haven where style meets substance in every product we offer.',
    'A unique boutique providing exceptional shopping experiences and personalized service.',
    'Explore our carefully selected inventory of trendy and timeless items.',
    'A shopping landmark known for its diverse product range and customer-focused approach.',
  ];

  const products = [
    'Our store features the latest collections from renowned designers and emerging brands alike.',
    'We specialize in handcrafted items that combine traditional craftsmanship with contemporary design.',
    'From everyday essentials to luxury indulgences, our merchandise caters to diverse tastes and needs.',
    'Each product is selected for its quality, uniqueness, and alignment with current trends.',
    'Our exclusive collections include limited-edition items not available elsewhere.',
  ];

  const experience = [
    'The thoughtfully designed store layout ensures a pleasant and efficient shopping journey.',
    'Our knowledgeable staff provides expert advice to help you make informed purchasing decisions.',
    'Regular in-store events offer opportunities to preview new collections and meet designers.',
    'The comfortable lounge area allows companions to relax while you browse our selections.',
    'Digital kiosks throughout the store provide additional product information and availability.',
  ];

  const conclusion = [
    'We offer convenient services including gift wrapping, personal shopping, and home delivery.',
    'Our loyalty program rewards frequent shoppers with exclusive discounts and early access to sales.',
    "Gift cards are available in various denominations, perfect for when you're unsure what to choose.",
    'Follow our social media channels for updates on new arrivals and special promotions.',
    "We're committed to sustainable practices and ethical sourcing throughout our operations.",
  ];

  return `${getRandomItem(intro)} ${getRandomItem(products)} ${getRandomItem(experience)} ${getRandomItem(conclusion)}`;
}

function generateEntertainmentDescription() {
  const intro = [
    'An exciting entertainment venue offering unforgettable experiences for visitors of all ages.',
    'Discover a world of fun and excitement in our state-of-the-art entertainment complex.',
    'A premier destination where thrilling activities and memorable moments await.',
    'Experience the ultimate in entertainment innovation with our diverse attractions.',
    'A landmark entertainment center designed to delight and inspire every guest.',
  ];

  const attractions = [
    'Our facility features cutting-edge attractions that combine technology with immersive experiences.',
    'From adrenaline-pumping activities to relaxing entertainment options, we have something for everyone.',
    'Our signature attractions have won multiple awards for their creativity and execution.',
    'Each experience is designed to engage multiple senses and create lasting memories.',
    'Seasonal special events and themed attractions keep the experience fresh throughout the year.',
  ];

  const amenities = [
    'Convenient dining options range from quick snacks to full-service restaurants within the venue.',
    'Comfortable rest areas allow guests to take breaks between activities and plan their next adventure.',
    'Our retail shops offer exclusive merchandise and souvenirs to commemorate your visit.',
    'Advanced ticketing systems minimize wait times and maximize enjoyment of all attractions.',
    'VIP packages provide enhanced experiences, priority access, and exclusive benefits.',
  ];

  const conclusion = [
    'Group packages are available for birthday celebrations, corporate events, and special occasions.',
    'Our friendly staff is dedicated to ensuring every visitor has a safe and enjoyable experience.',
    'Annual passes offer excellent value for those who plan to visit multiple times throughout the year.',
    'Download our mobile app for interactive maps, wait times, and exclusive in-app offers.',
    'We continuously update our offerings to provide fresh and exciting experiences for returning guests.',
  ];

  return `${getRandomItem(intro)} ${getRandomItem(attractions)} ${getRandomItem(amenities)} ${getRandomItem(conclusion)}`;
}

function generateGeneralDescription(categoryTitle) {
  return `A premium listing in the ${categoryTitle} category. This establishment offers exceptional services and products to meet all your needs. With a dedicated team of professionals, state-of-the-art facilities, and a commitment to customer satisfaction, we strive to provide an outstanding experience for every visitor. Our convenient location, flexible hours, and competitive pricing make us a preferred choice in the area. Whether you're a first-time visitor or a returning customer, we look forward to serving you and exceeding your expectations.`;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomBookingStyle() {
  const styles = ['standard', 'daily', 'hourly', 'slot', 'table'];
  return styles[Math.floor(Math.random() * styles.length)];
}

function getRandomIcon() {
  const icons = [
    'fa fa-cutlery',
    'fa fa-bed',
    'fa fa-shopping-bag',
    'fa fa-film',
    'fa fa-coffee',
    'fa fa-glass',
    'fa fa-music',
    'fa fa-car',
    'fa fa-plane',
    'fa fa-train',
    'fa fa-ship',
    'fa fa-bicycle',
    'fa fa-building',
    'fa fa-university',
    'fa fa-hospital-o',
    'fa fa-bank',
    'fa fa-briefcase',
    'fa fa-suitcase',
    'fa fa-laptop',
    'fa fa-mobile',
  ];
  return icons[Math.floor(Math.random() * icons.length)];
}

function generateRatingText(rating) {
  const ratingNum = Number.parseFloat(rating);
  if (ratingNum >= 4.5) return 'Exceptional';
  if (ratingNum >= 4.0) return 'Excellent';
  if (ratingNum >= 3.5) return 'Very Good';
  if (ratingNum >= 3.0) return 'Good';
  if (ratingNum >= 2.5) return 'Average';
  if (ratingNum >= 2.0) return 'Fair';
  if (ratingNum >= 1.5) return 'Poor';
  return 'Very Poor';
}

function getDayKey(day) {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[day];
}
