const { Setting, User, Category, Location, Image } = require('../models');

const changeLanguage = async (req, res) => {
  try {
    const { language, deviceId } = req.body;
    const { user } = req;
    let configs = await Setting.findOne({
      where: { deviceId: req.headers.deviceid },
    });
    if (configs) {
      configs.language = language;

      await configs.save();
    } else {
      configs = await Setting.create({
        language,
        deviceId,
        userId: user.id,
      });
    }

    await User.update(
      {
        language,
      },
      { where: { id: user.id } },
    );

    return res.status(200).json({
      data: configs,
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch for changeLanguage', e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
const getSettings = async (req, res) => {
  try {
    const where = {};

    if (req.headers?.deviceid) {
      where.deviceId = req.headers?.deviceid;
    }
    const settings = await Setting.findOne({
      where,
      order: [['createdAt', 'DESC']],
    });

    // Get categories with subcategories
    const categories = await Category.findAll({
      where: { type: 'category', parentId: null },
      include: [
        {
          model: Image,
          as: 'image',
          required: false,
        },
        {
          model: Category,
          as: 'subcategories',
          include: [
            {
              model: Image,
              as: 'image',
              required: false,
            },
          ],
        },
      ],
    });

    // Get features
    const features = await Category.findAll({
      where: { type: 'feature' },
      include: [
        {
          model: Image,
          as: 'image',
          required: false,
        },
      ],
    });

    // Get locations
    const locations = await Location.findAll({
      include: [
        {
          model: Location,
          as: 'children',
          required: false,
        },
      ],
    });

    // Format categories with subcategories
    const formattedCategories = categories.map((category) => ({
      term_id: category.id,
      name: category.title,
      count: category.count,
      image: category.image
        ? {
            id: category.image.id,
            full: { url: category.image.full },
            thumb: { url: category.image.thumb },
          }
        : undefined,
      icon: category.icon,
      color: category.color,
      taxonomy: category.type,
      has_child:
        category.hasChild ||
        (category.subcategories && category.subcategories.length > 0),
      parent_id: category.parentId,
      subcategories: category.subcategories?.map((subcat) => ({
        term_id: subcat.id,
        name: subcat.title,
        count: subcat.count,
        image: subcat.image
          ? {
              id: subcat.image.id,
              full: { url: subcat.image.full },
              thumb: { url: subcat.image.thumb },
            }
          : undefined,
        icon: subcat.icon,
        color: subcat.color,
        taxonomy: subcat.type,
        has_child: subcat.hasChild,
        parent_id: subcat.parentId,
      })),
    }));

    // Format response to match client expectations
    const response = {
      success: true,
      data: {
        settings: {
          layout_mode: settings?.layout || 'basic',
          layout_widget: settings?.useLayoutWidget || false,
          per_page: settings?.perPage || 20,
          list_mode: settings?.listMode || 'list',
          submit_listing: settings?.enableSubmit || true,
          price_min: settings?.minPrice || 0,
          price_max: settings?.maxPrice || 100,
          color_option: settings?.colors || [],
          unit_price: settings?.unit || 'USD',
          time_min: settings?.startHour || '08:00',
          time_max: settings?.endHour || '18:00',
          enableSubmit: settings?.enableSubmit || false,
          ...settings,
        },
        view_option: {
          view_address_use: settings?.useViewAddress || true,
          view_phone_use: settings?.useViewPhone || true,
          view_fax_use: settings?.useViewFax || true,
          view_email_use: settings?.useViewEmail || true,
          view_website_use: settings?.useViewWebsite || true,
          social_network_use: settings?.useViewSocial || true,
          view_status_use: settings?.useViewStatus || true,
          view_date_establish_use: settings?.useViewDateEstablish || true,
          view_galleries_use: settings?.useViewGalleries || true,
          view_attachment_use: settings?.useViewAttachment || true,
          view_video_url_use: settings?.useViewVideo || true,
          view_map_use: settings?.useViewMap || true,
          view_price_use: settings?.useViewPrice || true,
          view_opening_hour_use: settings?.useViewOpenHours || true,
          view_tags_use: settings?.useViewTags || true,
          view_feature_use: settings?.useViewFeature || true,
          view_admob_use: settings?.useViewAdmob || true,
        },
        categories: formattedCategories,
        features: features.map((feature) => ({
          term_id: feature.id,
          name: feature.title,
          count: feature.count,
          image: feature.image
            ? {
                id: feature.image.id,
                full: { url: feature.image.full },
                thumb: { url: feature.image.thumb },
              }
            : undefined,
          icon: feature.icon,
          color: feature.color,
          taxonomy: feature.type,
          has_child: feature.hasChild,
        })),
        locations: locations.map((location) => ({
          term_id: location.id,
          name: location.name,
          count: 0,
          type: location.type,
          children: location.children?.map((child) => ({
            term_id: child.id,
            name: child.name,
            type: child.type,
          })),
        })),
        place_sort_option: [
          { lang_key: 'newest', field: 'createdAt', value: 'DESC' },
          { lang_key: 'oldest', field: 'createdAt', value: 'ASC' },
          { lang_key: 'rating', field: 'rate', value: 'DESC' },
          { lang_key: 'title_asc', field: 'title', value: 'ASC' },
          { lang_key: 'title_desc', field: 'title', value: 'DESC' },
        ],
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  changeLanguage,
};
