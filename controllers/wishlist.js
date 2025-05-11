const { Wishlist, Product, Image, User } = require('../models');

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
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
    });

    // Format response
    const formattedWishlist = wishlistItems.map((item) => ({
      ID: item.Product.id,
      post_title: item.Product.title,
      post_date: item.Product.createdAt,
      rating_avg: item.Product.rate,
      rating_count: item.Product.numRate,
      wishlist: true,
      image: item.Product.image
        ? {
            id: item.Product.image.id,
            full: { url: item.Product.image.full },
            thumb: { url: item.Product.image.thumb },
          }
        : undefined,
      author: item.Product.author
        ? {
            id: item.Product.author.id,
            name: item.Product.author.name,
            user_photo: item.Product.author.image,
          }
        : undefined,
    }));

    res.status(200).json({
      success: true,
      data: formattedWishlist,
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
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const { product_id } = req.body;

    // Check if product exists
    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if already in wishlist
    const existingWishlist = await Wishlist.findOne({
      where: {
        userId,
        productId: product_id,
      },
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist',
      });
    }

    // Add to wishlist
    await Wishlist.create({
      userId,
      productId: product_id,
    });

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: {
        product_id,
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
    const { product_id } = req.body;

    // Remove from wishlist
    const result = await Wishlist.destroy({
      where: {
        userId,
        productId: product_id,
      },
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: {
        product_id,
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
    const userId = req.user.id; // Assuming user ID is available from auth middleware

    // Clear wishlist
    await Wishlist.destroy({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
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
