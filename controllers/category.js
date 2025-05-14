const { Category, Image } = require('../models');

// Get categories list
const getCategories = async (req, res) => {
  try {
    const { category_id } = req.query;

    const whereConditions = { type: 'category' };

    // If parent_id is provided, filter by parent
    if (category_id) {
      whereConditions.parentId = category_id;
    } else {
      // If no parent_id, get only top-level categories
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

// Get discovery categories
const getDiscoveryCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: {
        type: 'category',
        parentId: null, // Only top-level categories for discovery
      },
      include: [
        {
          model: Image,
          as: 'image',
          required: false,
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
