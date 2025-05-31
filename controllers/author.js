const {
  User,
  Product,
  Comment,
  Image,
  Wishlist,
  Category,
} = require('../models');

const getAuthorListing = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { user_id } = req.query;
    const { page = 1, per_page = 10 } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);
    const author = await User.findByPk(user_id || userId);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    const { count, rows } = await Product.findAndCountAll({
      where: { authorId: author.id },
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
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    const products = rows.map((product) => ({
      ...product.dataValues,
      useViewPhone: product.phone,
      ID: product.id,
      post_title: product.title,
      post_date: product.createdAt,
      rating_avg: product.rate,
      rating_count: product.numRate,
      wishlist: product.wishlist?.productId === product.id,
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
      booking_use: product.bookingStyle !== 'no_booking',
      booking_price_display: `${(+product.priceDisplay || 0).toFixed(2)}$`,
    }));

    res.status(200).json({
      success: true,
      data: products,
      user: author,
      pagination: {
        page: Number.parseInt(page),
        per_page: limit,
        total: count,
        max_page: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching author listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch author listings',
      error: error.message,
    });
  }
};

const getAuthorInfo = async (req, res) => {
  try {
    const { id } = req.params;

    // Get author
    const author = await User.findByPk(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Count author's products
    const productCount = await Product.count({
      where: { authorId: id },
    });

    // Format response
    const response = {
      id: author.id,
      name: author.name,
      first_name: author.firstName,
      last_name: author.lastName,
      user_photo: author.image,
      user_url: author.url,
      user_level: author.level,
      description: author.description,
      tag: author.tag,
      rating_avg: author.rate,
      total_comment: author.comment,
      total: productCount,
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching author info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch author info',
      error: error.message,
    });
  }
};

// Get author reviews
const getAuthorReviews = async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 10,
      user_id,
      orderby = 'createdAt',
      order = 'asc',
    } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);
    // Check if author exists
    const author = await User.findByPk(user_id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Get author's products
    const products = await Product.findAll({
      where: { authorId: user_id },
      attributes: ['id'],
    });

    const productIds = products.map((product) => product.id);

    // Get comments for these products
    const comments = await Comment.findAndCountAll({
      where: {
        productId: productIds,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'image', 'email'],
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title'],
        },
      ],
      limit,
      offset,
      order: [[orderby, order]],
    });

    // Format response
    const formattedComments = comments.rows.map((comment) => ({
      comment_ID: comment.id,
      comment_author: comment.user.name,
      comment_author_email: comment.user.email,
      comment_author_image: comment.user.image,
      comment_content: comment.content,
      comment_date: comment.createdAt,
      user_id: comment.user.id,
      rate: comment.rate,
      post_title: comment.product.title,
    }));

    res.status(200).json({
      success: true,
      pagination: {
        page: Number.parseInt(page),
        per_page: limit,
        total: comments.count,
        max_page: Math.ceil(comments.count / limit),
      },
      data: formattedComments,
    });
  } catch (error) {
    console.error('Error fetching author reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch author reviews',
      error: error.message,
    });
  }
};

module.exports = {
  getAuthorListing,
  getAuthorInfo,
  getAuthorReviews,
};
