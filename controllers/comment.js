const { Comment, User, Product, Blog } = require('../models');

// Get comments
const getComments = async (req, res) => {
  try {
    const { post_id, type = 'product' } = req.query;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        message: 'Post ID is required',
      });
    }

    // Build where conditions
    const whereConditions = {};

    if (type === 'product') {
      whereConditions.productId = post_id;
    } else if (type === 'blog') {
      whereConditions.blogId = post_id;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type',
      });
    }

    const comments = await Comment.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'image', 'email'],
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
      post_title: comment.postName,
    }));

    res.status(200).json({
      success: true,
      data: formattedComments,
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments',
      error: error.message,
    });
  }
};

// Save comment
const saveComment = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available from auth middleware
    const { post_id, content, rate, type = 'product' } = req.body;

    if (!post_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'Post ID and content are required',
      });
    }

    // Check if post exists
    let postName = '';

    if (type === 'product') {
      const product = await Product.findByPk(post_id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }

      postName = product.title;
    } else if (type === 'blog') {
      const blog = await Blog.findByPk(post_id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: 'Blog not found',
        });
      }

      postName = blog.title;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type',
      });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      postName,
      rate: rate || 0,
      userId,
      productId: type === 'product' ? post_id : null,
      blogId: type === 'blog' ? post_id : null,
    });

    // Update post comment count and rating
    if (type === 'product') {
      const product = await Product.findByPk(post_id);

      // Update comment count
      product.numRate += 1;

      // Update rating average
      const comments = await Comment.findAll({
        where: { productId: post_id },
      });

      const totalRating = comments.reduce(
        (sum, comment) => sum + comment.rate,
        0,
      );
      product.rate = totalRating / comments.length;

      await product.save();
    } else if (type === 'blog') {
      const blog = await Blog.findByPk(post_id);

      // Update comment count
      blog.numComments += 1;

      await blog.save();
    }

    // Get user info
    const user = await User.findByPk(userId);

    // Format response
    const response = {
      comment_ID: comment.id,
      comment_author: user.name,
      comment_author_email: user.email,
      comment_author_image: user.image,
      comment_content: comment.content,
      comment_date: comment.createdAt,
      user_id: user.id,
      rate: comment.rate,
      post_title: postName,
    };

    res.status(200).json({
      success: true,
      message: 'Comment saved successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save comment',
      error: error.message,
    });
  }
};

module.exports = {
  getComments,
  saveComment,
};
