const { Category, Image, Product, User, Location } = require('../models');

const getCategories = async (req, res) => {
  try {
    const { category_id } = req.query;

    const whereConditions = { type: 'category' };

    if (category_id) {
      whereConditions.parentId = category_id;
    } else {
      whereConditions.parentId = null;
    }

    const categories = await Category.findAll({
      where: whereConditions,
      include: [
        {
          model: Image,
          as: 'image',
          required: false,
        },
        {
          model: Category,
          as: 'subcategories',
          required: false,
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

    res.status(200).json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

const getDiscoveryCategories = async (req, res) => {
  try {
    const { country } = req.query;
    const location = await Location.findOne({
      where: {
        name: country,
        type: 'country',
      },
    });

    const categories = await Category.findAll({
      where: {
        type: 'category',
        parentId: null,
      },
      include: [
        {
          model: Image,
          as: 'image',
          required: false,
        },
        {
          model: Product,
          as: 'featuredProducts',
          required: false,
          where: {
            countryId: location?.id,
          },
          include: [
            {
              model: Image,
              as: 'image',
            },
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'image'],
            },
            {
              model: Category,
              as: 'category',
              include: [
                {
                  model: Image,
                  as: 'image',
                },
              ],
            },
          ],
        },
      ],
      order: [['count', 'DESC']],
      limit: 10,
    });

    // Format response
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
      has_child: category.hasChild,
      parent_id: category.parentId,
      featuredProducts: category.featuredProducts.map((product) => ({
        id: product.id,
        post_title: product.title,
        post_date: product.createdAt,
        rating_avg: product.rate,
        rating_count: product.numRate,
        wishlist: false,
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
              user_photo: product.author.image,
            }
          : undefined,
        category: product.category
          ? {
              term_id: product.category.id,
              name: product.category.title,
              taxonomy: product.category.type,
            }
          : undefined,
        price_min: product.priceMin,
        price_max: product.priceMax,
        address: product.address,
      })),
    }));

    res.status(200).json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching discovery categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch discovery categories',
      error: error.message,
    });
  }
};

// Add a new endpoint to get subcategories for a specific category
const getSubcategories = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
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

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Format response
    const subcategories =
      category.subcategories?.map((subcat) => ({
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
      })) || [];

    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subcategories',
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getDiscoveryCategories,
  getSubcategories,
};
