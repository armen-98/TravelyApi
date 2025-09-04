const {
  Product,
  Category,
  User,
  Image,
  OpenTime,
  Schedule,
  File,
  Location,
  Tag,
  Facility,
  WorkingSchedule,
  TimeSlot,
  ProductSocialNetwork,
  Wishlist,
} = require('../models');
const { Op } = require('sequelize');

const getProductForm = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        type: 'category',
      },
      include: [
        {
          model: Image,
          as: 'image',
        },
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
      ],
      order: [
        ['title', 'ASC'],
        [{ model: Category, as: 'subcategories' }, 'title', 'ASC'],
      ],
    });

    // Get features
    const features = await Category.findAll({
      where: { type: 'feature' },
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
      order: [['title', 'ASC']],
    });

    // Get countries
    const countries = await Location.findAll({
      where: {
        type: 'country',
        parentId: null,
      },
      order: [['name', 'ASC']],
    });

    // Get states
    const states = await Location.findAll({
      where: { type: 'state' },
      order: [['name', 'ASC']],
    });

    // Get cities
    const cities = await Location.findAll({
      where: { type: 'city' },
      order: [['name', 'ASC']],
    });

    // Get tags
    const tags = await Tag.findAll({
      order: [['name', 'ASC']],
    });

    // Get facilities
    const facilities = await Facility.findAll({
      order: [['name', 'ASC']],
    });

    // Format categories
    const formattedCategories = categories.map((category) => ({
      term_id: category.id,
      name: category.title,
      count: category.count || 0,
      taxonomy: category.type,
      icon: category.icon,
      color: category.color,
      has_child: category.subcategories && category.subcategories.length > 0,
      image: category.image
        ? {
            id: category.image.id,
            full: { url: category.image.full },
            thumb: { url: category.image.thumb },
          }
        : null,
      children: category.subcategories
        ? category.subcategories.map((subcat) => ({
            term_id: subcat.id,
            name: subcat.title,
            count: subcat.count || 0,
            taxonomy: subcat.type,
            icon: subcat.icon,
            color: subcat.color,
            has_child: false,
            image: subcat.image
              ? {
                  id: subcat.image.id,
                  full: { url: subcat.image.full },
                  thumb: { url: subcat.image.thumb },
                }
              : null,
          }))
        : [],
    }));

    // Format features
    const formattedFeatures = features.map((feature) => ({
      term_id: feature.id,
      name: feature.title,
      count: feature.count || 0,
      taxonomy: feature.type,
      icon: feature.icon,
      color: feature.color,
      image: feature.image
        ? {
            id: feature.image.id,
            full: { url: feature.image.full },
            thumb: { url: feature.image.thumb },
          }
        : null,
    }));

    // Format locations
    const formattedCountries = countries.map((country) => ({
      term_id: country.id,
      name: country.name,
      count: country.count || 0,
      taxonomy: 'location',
      has_child: true,
    }));

    const formattedStates = states.map((state) => ({
      term_id: state.id,
      name: state.name,
      count: state.count || 0,
      taxonomy: 'location',
      parent_id: state.parentId,
      has_child: true,
    }));

    const formattedCities = cities.map((city) => ({
      term_id: city.id,
      name: city.name,
      count: city.count || 0,
      taxonomy: 'location',
      parent_id: city.parentId,
      has_child: false,
    }));

    // Format tags
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count || 0,
      color: tag.color,
    }));

    // Format facilities
    const formattedFacilities = facilities.map((facility) => ({
      id: facility.id,
      name: facility.name,
      icon: facility.icon,
      description: facility.description,
      count: facility.count || 0,
    }));

    res.status(200).json({
      success: true,
      data: {
        categories: formattedCategories,
        features: formattedFeatures,
        countries: formattedCountries,
        states: formattedStates,
        cities: formattedCities,
        tags: formattedTags,
        facilities: formattedFacilities,
      },
    });
  } catch (error) {
    console.error('Error fetching product form data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product form data',
      error: error.message,
    });
  }
};

const sortByValues = {
  'Latest Post': [['createdAt', 'DESC']],
  Rating: [['rate', 'DESC']],
  Distance: [['rate', 'DESC']],
  'Price: Low to High': [['priceMin', 'ASC']],
  'Price: High to Low': [['priceMax', 'DESC']],
};

// Get product listings
const getListings = async (req, res) => {
  try {
    const {
      s: keyword,
      country,
      state,
      city,
      rating,
      priceMin,
      priceMax,
      sortBy = 'Latest Post',
      categories,
      distance,
      color,
      page = 1,
      per_page = 20,
      startTime,
      endTime,
      features,
    } = req.query;
    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);

    // Build where conditions
    const whereConditions = {};

    if (keyword) {
      whereConditions.title = { [Op.like]: `%${keyword}%` };
    }

    if (+priceMin) {
      whereConditions.priceMin = { [Op.gte]: Number(priceMin) };
    }

    if (+priceMax) {
      whereConditions.priceMax = { [Op.lte]: Number(priceMax) };
    }

    if (+rating) {
      whereConditions.rate = { [Op.gte]: Number(rating) };
    }

    if (color) {
      whereConditions.color = color;
    }

    // Build include conditions
    const includeConditions = [
      {
        model: User,
        as: 'author',
        attributes: [
          'id',
          'name',
          'firstName',
          'lastName',
          'image',
          'url',
          'level',
          'description',
          'tag',
          'rate',
        ],
      },
      {
        model: Image,
        as: 'image',
      },
      {
        model: Category,
        as: 'category',
        ...(categories?.length > 0
          ? {
              where: {
                title: { [Op.in]: categories.split(',') },
              },
            }
          : {}),
      },
    ];

    if (features) {
      includeConditions.push({
        model: Facility,
        as: 'facilities',
        where: { name: { [Op.in]: features.split(',') } },
      });
    }

    // Add location filter
    if (country) {
      includeConditions.push({
        model: Location,
        as: 'country',
        where: { name: country },
      });
    }
    if (state) {
      includeConditions.push({
        model: Location,
        as: 'state',
        where: { name: state },
      });
    }
    if (city) {
      includeConditions.push({
        model: Location,
        as: 'city',
        where: { name: city },
      });
    }

    // Query products
    const { count, rows } = await Product.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      ...(sortByValues[sortBy] ? { order: sortByValues[sortBy] } : {}),
      offset,
      limit,
      distinct: true,
    });

    // Format response
    const products = rows.map((product) => ({
      ID: product.id,
      post_title: product.title,
      post_date: product.createdAt,
      date_establish: product.dateEstablish,
      rating_avg: product.rate,
      rating_count: product.numRate,
      post_status: product.status,
      wishlist: false, // This would be determined by user's wishlist
      claim_use: product.useClaim,
      claim_verified: product.claimVerified,
      address: product.address,
      zip_code: product.zipCode,
      phone: product.phone,
      fax: product.fax,
      email: product.email,
      website: product.website,
      post_excerpt: product.description,
      color: product.color,
      icon: product.icon,
      price_min: product.priceMin,
      price_max: product.priceMax,
      booking_price_display: `${(+product.priceDisplay || 0).toFixed(2)}$`,
      booking_style: product.bookingStyle,
      latitude: product.latitude,
      longitude: product.longitude,
      guid: product.link,
      image: product.image
        ? {
            id: product.image.id,
            full: { url: product.image.full },
            thumb: { url: product.image.thumb },
          }
        : undefined,
      author: product.author
        ? {
            id: product.author.id,
            name: product.author.name,
            first_name: product.author.firstName,
            last_name: product.author.lastName,
            user_photo: product.author.image,
            user_url: product.author.url,
            user_level: product.author.level,
            description: product.author.description,
            tag: product.author.tag,
            rating_avg: product.author.rate,
          }
        : undefined,
      category: product.category
        ? {
            term_id: product.category.id,
            name: product.category.title,
            taxonomy: product.category.type,
          }
        : undefined,
    }));

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: Number.parseInt(page),
        per_page: limit,
        total: count,
        max_page: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message,
    });
  }
};

// Get product details
const getProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: [
            'id',
            'name',
            'firstName',
            'lastName',
            'image',
            'url',
            'level',
            'description',
            'tag',
            'rate',
          ],
        },
        {
          model: Category,
          as: 'category',
        },
        {
          model: Wishlist,
          as: 'wishlist',
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
        },
        {
          model: Facility,
          as: 'facilities',
        },
        {
          model: Image,
          as: 'image',
        },
        {
          model: Image,
          as: 'galleries',
        },
        {
          model: OpenTime,
          as: 'openHours',
          include: [
            {
              model: Schedule,
              as: 'schedules',
            },
          ],
        },
        {
          model: File,
          as: 'attachments',
        },
        {
          model: Location,
          as: 'country',
        },
        {
          model: Location,
          as: 'state',
        },
        {
          model: Location,
          as: 'city',
        },
        {
          model: WorkingSchedule,
          as: 'workingSchedules',
          include: [
            {
              model: TimeSlot,
              as: 'timeSlots',
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get related products
    const relatedProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: product.id },
      },
      include: [
        {
          model: Image,
          as: 'image',
        },
        {
          model: Wishlist,
          as: 'wishlist',
        },
        {
          model: User,
          as: 'author',
        },
      ],
      limit: 5,
    });

    // Get latest products
    const latestProducts = await Product.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        id: { [Op.ne]: product.id },
      },
      include: [
        {
          model: Image,
          as: 'image',
        },
        {
          model: Wishlist,
          as: 'wishlist',
        },
        {
          model: User,
          as: 'author',
        },
      ],
      limit: 5,
    });

    // Format response
    const response = {
      ID: product.id,
      post_title: product.title,
      post_date: product.createdAt,
      date_establish: product.dateEstablish,
      rating_avg: product.rate,
      rating_count: product.numRate,
      post_status: product.status,
      wishlist: product.id === product.wishlist?.productId,
      claim_use: product.useClaim,
      claim_verified: product.claimVerified,
      address: product.address,
      zip_code: product.zipCode,
      phone: product.phone,
      fax: product.fax,
      email: product.email,
      website: product.website,
      post_excerpt: product.description,
      color: product.color,
      icon: product.icon,
      price_min: product.priceMin,
      price_max: product.priceMax,
      booking_price_display: `${(+product.priceDisplay || 0).toFixed(2)}$`,
      booking_style: product.bookingStyle,
      latitude: product.latitude,
      longitude: product.longitude,
      guid: product.link,
      video_url: product.videoURL,
      social_network: product.socials,

      image: product.image
        ? {
            id: product.image.id,
            full: { url: product.image.full },
            thumb: { url: product.image.thumb },
          }
        : undefined,

      galleries: product.galleries.map((gallery) => ({
        id: gallery.id,
        full: { url: gallery.full },
        thumb: { url: gallery.thumb },
      })),

      author: product.author
        ? {
            id: product.author.id,
            name: product.author.name,
            first_name: product.author.firstName,
            last_name: product.author.lastName,
            user_photo: product.author.image,
            user_url: product.author.url,
            user_level: product.author.level,
            description: product.author.description,
            tag: product.author.tag,
            rating_avg: product.author.rate,
          }
        : undefined,

      category: product.category
        ? {
            term_id: product.category.id,
            name: product.category.title,
            taxonomy: product.category.type,
          }
        : undefined,

      // features: product.features.map((feature) => ({
      //   term_id: feature.id,
      //   name: feature.title,
      //   taxonomy: feature.type,
      // })),

      tags: product.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        color: tag.color,
      })),

      facilities: product.facilities?.map((facility) => ({
        id: facility.id,
        name: facility.name,
        icon: facility.icon,
        value: facility.product_facilities?.value,
      })),

      opening_hour: product.openHours.map((openTime) => ({
        dayOfWeek: openTime.dayOfWeek,
        key: openTime.key,
        schedule: openTime.schedules.map((schedule) => ({
          format: schedule.view,
          start: schedule.start,
          end: schedule.end,
        })),
      })),

      attachments: product.attachments.map((file) => ({
        name: `${file.name}.${file.type}`,
        url: file.url,
        size: file.size,
      })),

      location: {
        country: product.country
          ? {
              term_id: product.country.id,
              name: product.country.name,
              taxonomy: 'location',
            }
          : undefined,
        state: product.state
          ? {
              term_id: product.state.id,
              name: product.state.name,
              taxonomy: 'location',
            }
          : undefined,
        city: product.city
          ? {
              term_id: product.city.id,
              name: product.city.name,
              taxonomy: 'location',
            }
          : undefined,
      },

      related: relatedProducts.map((related) => ({
        ...related.dataValues,
        useViewPhone: related.phone,
        ID: related.id,
        post_title: related.title,
        post_date: related.createdAt,
        rating_avg: related.rate,
        rating_count: related.numRate,
        wishlist: related.id === related.wishlist?.productId,
        image: related.image
          ? {
              id: related.image.id,
              full: { url: related.image.full },
              thumb: { url: related.image.thumb },
            }
          : undefined,
        author: related.author
          ? {
              id: related.author.id,
              name: related.author.name,
              user_photo: related.author.image,
            }
          : undefined,
        category: related.category
          ? {
              term_id: related.category.id,
              name: related.category.title,
              taxonomy: related.category.type,
            }
          : undefined,
        price_min: related.priceMin,
        price_max: related.priceMax,
        address: related.address,
        booking_use: related.bookingStyle !== 'no_booking',
        booking_price_display: `${(+related.priceDisplay || 0).toFixed(2)}$`,
      })),

      lastest: latestProducts.map((latest) => ({
        ...latest.dataValues,
        useViewPhone: latest.phone,
        ID: latest.id,
        post_title: latest.title,
        post_date: latest.createdAt,
        rating_avg: latest.rate,
        rating_count: latest.numRate,
        wishlist: latest.id === latest.wishlist?.productId,
        image: latest.image
          ? {
              id: latest.image.id,
              full: { url: latest.image.full },
              thumb: { url: latest.image.thumb },
            }
          : undefined,
        author: latest.author
          ? {
              id: latest.author.id,
              name: latest.author.name,
              user_photo: latest.author.image,
            }
          : undefined,
        category: latest.category
          ? {
              term_id: latest.category.id,
              name: latest.category.title,
              taxonomy: latest.category.type,
            }
          : undefined,
        price_min: latest.priceMin,
        price_max: latest.priceMax,
        address: latest.address,
        booking_use: latest.bookingStyle !== 'no_booking',
        booking_price_display: `${(+latest.priceDisplay || 0).toFixed(2)}$`,
      })),
      workingSchedule: product.workingSchedules?.map((day) => ({
        id: day.id,
        dayOfWeek: day.dayOfWeek,
        dayName: getDayName(day.dayOfWeek),
        isOpen: day.isOpen,
        openAllDay: day.openAllDay,
        isClosed: day.isClosed,
        timeSlots: day.timeSlots?.map((slot) => ({
          id: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          label: slot.label,
        })),
      })),
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product details',
      error: error.message,
    });
  }
};

// Save product
const saveProduct = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const productData = req.body;

    // Check if updating existing product
    let product;
    if (productData.id) {
      product = await Product.findByPk(productData.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      // Check if user is the author
      if (product.authorId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this product',
        });
      }

      // Update product fields
      await product.update({
        title: productData.title,
        description: productData.description,
        address: productData.address,
        zipCode: productData.zipCode,
        phone: productData.phone,
        fax: productData.fax,
        email: productData.email,
        website: productData.website,
        videoURL: productData.video_url,
        priceMin: productData.price_min,
        priceMax: productData.price_max,
        latitude: productData.latitude,
        longitude: productData.longitude,
        categoryId: productData.category_id,
        countryId: productData.country_id,
        stateId: productData.state_id,
        cityId: productData.city_id,
        socials: productData.social_network || {},
        // Social network fields
        facebookUsername: productData.facebook_username,
        facebookUrl: productData.facebook_url,
        twitterUsername: productData.twitter_username,
        twitterUrl: productData.twitter_url,
        instagramUsername: productData.instagram_username,
        instagramUrl: productData.instagram_url,
        googleUsername: productData.google_username,
        googleUrl: productData.google_url,
        linkedinUsername: productData.linkedin_username,
        linkedinUrl: productData.linkedin_url,
        youtubeUsername: productData.youtube_username,
        youtubeUrl: productData.youtube_url,
        tumblrUsername: productData.tumblr_username,
        tumblrUrl: productData.tumblr_url,
        flickrUsername: productData.flickr_username,
        flickrUrl: productData.flickr_url,
        pinterestUsername: productData.pinterest_username,
        pinterestUrl: productData.pinterest_url,
        telegramUsername: productData.telegram_username,
        telegramUrl: productData.telegram_url,
      });
    } else {
      // Create new product
      product = await Product.create({
        title: productData.title,
        description: productData.description,
        address: productData.address,
        zipCode: productData.zipCode,
        phone: productData.phone,
        fax: productData.fax,
        email: productData.email,
        website: productData.website,
        videoURL: productData.video_url,
        priceMin: productData.price_min,
        priceMax: productData.price_max,
        latitude: productData.latitude,
        longitude: productData.longitude,
        categoryId: productData.category_id,
        countryId: productData.country_id,
        stateId: productData.state_id,
        cityId: productData.city_id,
        authorId: userId,
        socials: productData.social_network || {},
        // Social network fields
        facebookUsername: productData.facebook_username,
        facebookUrl: productData.facebook_url,
        twitterUsername: productData.twitter_username,
        twitterUrl: productData.twitter_url,
        instagramUsername: productData.instagram_username,
        instagramUrl: productData.instagram_url,
        googleUsername: productData.google_username,
        googleUrl: productData.google_url,
        linkedinUsername: productData.linkedin_username,
        linkedinUrl: productData.linkedin_url,
        youtubeUsername: productData.youtube_username,
        youtubeUrl: productData.youtube_url,
        tumblrUsername: productData.tumblr_username,
        tumblrUrl: productData.tumblr_url,
        flickrUsername: productData.flickr_username,
        flickrUrl: productData.flickr_url,
        pinterestUsername: productData.pinterest_username,
        pinterestUrl: productData.pinterest_url,
        telegramUsername: productData.telegram_username,
        telegramUrl: productData.telegram_url,
      });
    }

    // Handle image
    if (productData.image_id) {
      await Image.update(
        { productId: product.id },
        { where: { id: productData.image_id } },
      );
    }

    // Handle features
    if (productData.features && Array.isArray(productData.features)) {
      // Remove existing features
      await product.setFeatures([]);

      // Add new features
      await product.addFeatures(productData.features);
    }

    // Handle tags
    if (productData.tags && Array.isArray(productData.tags)) {
      // Remove existing tags
      await product.setTags([]);

      // Add new tags
      await product.addTags(productData.tags);
    }

    // Handle facilities
    if (productData.facilities && Array.isArray(productData.facilities)) {
      // Remove existing facilities
      await product.setFacilities([]);

      // Add new facilities
      for (const facility of productData.facilities) {
        await product.addFacility(facility.id, {
          through: { value: facility.value || null },
        });
      }
    }

    // Handle social networks
    if (
      productData.social_networks &&
      Array.isArray(productData.social_networks)
    ) {
      // Remove existing social networks
      await ProductSocialNetwork.destroy({
        where: { productId: product.id },
      });

      // Add new social networks
      const socialNetworkRecords = productData.social_networks.map(
        (network) => ({
          productId: product.id,
          socialNetworkId: network.id,
          username: network.username,
          url: network.url,
          displayOrder: network.displayOrder || 0,
        }),
      );

      await ProductSocialNetwork.bulkCreate(socialNetworkRecords);
    }

    // Handle opening hours
    if (productData.opening_hour && Array.isArray(productData.opening_hour)) {
      // Remove existing opening hours
      await OpenTime.destroy({ where: { productId: product.id } });

      // Add new opening hours
      for (const openTime of productData.opening_hour) {
        const newOpenTime = await OpenTime.create({
          dayOfWeek: openTime.dayOfWeek,
          key: openTime.key,
          productId: product.id,
        });

        // Add schedules
        if (openTime.schedule && Array.isArray(openTime.schedule)) {
          for (const schedule of openTime.schedule) {
            await Schedule.create({
              view: schedule.format,
              start: schedule.start,
              end: schedule.end,
              openTimeId: newOpenTime.id,
            });
          }
        }
      }
    }

    // Handle working schedules
    if (
      productData.working_schedule &&
      Array.isArray(productData.working_schedule)
    ) {
      // Remove existing working schedules
      await WorkingSchedule.destroy({ where: { productId: product.id } });

      // Add new working schedules
      for (const day of productData.working_schedule) {
        const schedule = await WorkingSchedule.create({
          productId: product.id,
          dayOfWeek: day.dayOfWeek,
          isOpen: day.isOpen,
          openAllDay: day.openAllDay,
          isClosed: day.isClosed,
        });

        // Add time slots
        if (day.timeSlots && Array.isArray(day.timeSlots)) {
          for (const slot of day.timeSlots) {
            await TimeSlot.create({
              scheduleId: schedule.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              label: slot.label,
            });
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: productData.id
        ? 'Product updated successfully'
        : 'Product created successfully',
      data: {
        id: product.id,
      },
    });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save product',
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the author
    if (product.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this product',
      });
    }

    // Delete product
    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

function getDayName(dayOfWeek) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[dayOfWeek];
}

module.exports = {
  getListings,
  getProduct,
  saveProduct,
  deleteProduct,
  getProductForm,
};
