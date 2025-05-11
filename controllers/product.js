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
} = require('../models');
const { Op } = require('sequelize');

// Get product listings
const getListings = async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 20,
      s: keyword,
      category,
      feature,
      location,
      distance,
      price_min,
      price_max,
      color,
      orderby = 'createdAt',
      order = 'DESC',
      start_time,
      end_time,
    } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);

    // Build where conditions
    const whereConditions = {};

    if (keyword) {
      whereConditions.title = { [Op.like]: `%${keyword}%` };
    }

    if (price_min) {
      whereConditions.priceMin = { [Op.gte]: price_min };
    }

    if (price_max) {
      whereConditions.priceMax = { [Op.lte]: price_max };
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
      },
    ];

    // Add category filter
    if (category) {
      includeConditions.push({
        model: Category,
        as: 'category',
        where: { id: category },
      });
    }

    // Add feature filter
    if (feature) {
      includeConditions.push({
        model: Category,
        as: 'features',
        where: { id: feature },
      });
    }

    // Add location filter
    if (location) {
      includeConditions.push({
        model: Location,
        as: 'country',
        where: { id: location },
      });
    }

    // Query products
    const { count, rows } = await Product.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      order: [[orderby, order]],
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
      booking_price_display: product.priceDisplay,
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
    const { id } = req.params;

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
          model: Category,
          as: 'features',
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
        },
        {
          model: Facility,
          as: 'facilities',
          through: { attributes: ['value'] },
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
          model: User,
          as: 'author',
        },
      ],
      limit: 5,
    });

    // Format social networks
    const socialNetworks = [
      {
        name: 'Facebook',
        slug: 'facebook',
        icon: 'facebook',
        color: '#1877F2',
        username: product.facebookUsername,
        url: product.facebookUrl,
      },
      {
        name: 'Twitter (X)',
        slug: 'twitter',
        icon: 'twitter',
        color: '#000000',
        username: product.twitterUsername,
        url: product.twitterUrl,
      },
      {
        name: 'Instagram',
        slug: 'instagram',
        icon: 'instagram',
        color: '#E4405F',
        username: product.instagramUsername,
        url: product.instagramUrl,
      },
      {
        name: 'Google',
        slug: 'google',
        icon: 'google',
        color: '#4285F4',
        username: product.googleUsername,
        url: product.googleUrl,
      },
      {
        name: 'LinkedIn',
        slug: 'linkedin',
        icon: 'linkedin',
        color: '#0A66C2',
        username: product.linkedinUsername,
        url: product.linkedinUrl,
      },
      {
        name: 'YouTube',
        slug: 'youtube',
        icon: 'youtube',
        color: '#FF0000',
        username: product.youtubeUsername,
        url: product.youtubeUrl,
      },
      {
        name: 'Tumblr',
        slug: 'tumblr',
        icon: 'tumblr',
        color: '#36465D',
        username: product.tumblrUsername,
        url: product.tumblrUrl,
      },
      {
        name: 'Flickr',
        slug: 'flickr',
        icon: 'flickr',
        color: '#0063DC',
        username: product.flickrUsername,
        url: product.flickrUrl,
      },
      {
        name: 'Pinterest',
        slug: 'pinterest',
        icon: 'pinterest',
        color: '#E60023',
        username: product.pinterestUsername,
        url: product.pinterestUrl,
      },
      {
        name: 'Telegram',
        slug: 'telegram',
        icon: 'telegram',
        color: '#26A5E4',
        username: product.telegramUsername,
        url: product.telegramUrl,
      },
    ].filter((network) => network.username || network.url);

    // Format response
    const response = {
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
      booking_price_display: product.priceDisplay,
      booking_style: product.bookingStyle,
      latitude: product.latitude,
      longitude: product.longitude,
      guid: product.link,
      video_url: product.videoURL,
      social_network: product.socials,
      social_networks: socialNetworks,

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

      features: product.features.map((feature) => ({
        term_id: feature.id,
        name: feature.title,
        taxonomy: feature.type,
      })),

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
        ID: related.id,
        post_title: related.title,
        post_date: related.createdAt,
        rating_avg: related.rate,
        rating_count: related.numRate,
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
      })),

      lastest: latestProducts.map((latest) => ({
        ID: latest.id,
        post_title: latest.title,
        post_date: latest.createdAt,
        rating_avg: latest.rate,
        rating_count: latest.numRate,
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
};
