const { User, Product, Comment, Image } = require('../models');

const getAuthorListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, per_page = 10 } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);

    const author = await User.findByPk(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    const { count, rows } = await Product.findAndCountAll({
      where: { authorId: id },
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    const products = rows.map((product) => ({
      ID: product.id,
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
      author: {
        id: author.id,
        name: author.name,
        user_photo: author.image,
      },
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
    const { id } = req.params;

    // Check if author exists
    const author = await User.findByPk(id);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found',
      });
    }

    // Get author's products
    const products = await Product.findAll({
      where: { authorId: id },
      attributes: ['id'],
    });

    const productIds = products.map((product) => product.id);

    // Get comments for these products
    const comments = await Comment.findAll({
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
      order: [['createdAt', 'DESC']],
    });

    // Format response
    const formattedComments = comments.map((comment) => ({
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
