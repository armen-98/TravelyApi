const { Wishlist, Product, Image, User } = require('../models');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const { page = 1, perPage = 10 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * +perPage;

    const wishlistItems = await Wishlist.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
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
          ],
        },
      ],
      limit: +perPage,
      offset,
    });
    // Format response
    const formattedWishlist = wishlistItems.rows.map((item) => ({
      ...item.dataValues,
      ...item.product.dataValues,
      useViewPhone: item.product.phone,
      id: item.product.id,
      post_title: item.product.title,
      post_date: item.product.createdAt,
      rating_avg: item.product.rate,
      rating_count: item.product.numRate,
      wishlist: item.product.id === item.productId,
      image: item.product.image
        ? {
            id: item.product.image.id,
            full: { url: item.product.image.full },
            thumb: { url: item.product.image.thumb },
          }
        : undefined,
      author: item.product.author
        ? {
            id: item.product.author.id,
            name: item.product.author.name,
            user_photo: item.product.author.image,
          }
        : undefined,
      category: item.product.category
        ? {
            term_id: item.product.category.id,
            name: item.product.category.title,
            taxonomy: item.product.category.type,
          }
        : undefined,
      price_min: item.product.priceMin,
      price_max: item.product.priceMax,
      address: item.product.address,
      booking_use: item.product.bookingStyle !== 'no_booking',
      booking_style: item.product.bookingStyle,
      booking_price_display: `${(+item.product.priceDisplay || 0).toFixed(2)}$`,
    }));

    const total = wishlistItems.count;
    const maxPage = Math.ceil(total / perPage);
    const allowMore = page < maxPage;

    const pagination = {
      total,
      page,
      perPage,
      allowMore,
      maxPage,
    };

    return res.status(200).json({
      success: true,
      data: formattedWishlist,
      pagination,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message,
    });
  }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id } = req.body;

    // Check if product exists
    const product = await Product.findByPk(post_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: res.__('product_not_found'),
      });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      where: {
        userId,
        productId: post_id,
      },
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: res.__('already_wishlist'),
      });
    }

    // Add to wishlist
    await Wishlist.create({
      userId,
      productId: post_id,
    });

    res.status(200).json({
      success: true,
      message: res.__('product_added_wishlist'),
      data: {
        post_id,
      },
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message,
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const { post_id } = req.body;

    // Remove from wishlist
    const result = await Wishlist.destroy({
      where: {
        userId,
        productId: post_id,
      },
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: res.__('product_not_found'),
      });
    }

    res.status(200).json({
      success: true,
      message: res.__('product_removed'),
      data: {
        post_id,
      },
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message,
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.destroy({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: res.__('wishlist_clear'),
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
