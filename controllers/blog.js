const { Blog, Category, User, Image, Comment } = require('../models');
const { Op } = require('sequelize');

// Get blog home data
const getBlogHome = async (req, res) => {
  try {
    const { page = 1, per_page = 10, s: keyword, category_id } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);

    // Build where conditions
    const whereConditions = {
      status: 'publish',
    };

    if (keyword) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
      ];
    }

    // Build include conditions
    const includeConditions = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'firstName', 'lastName', 'image'],
      },
      {
        model: Image,
        as: 'image',
      },
    ];

    // Add category filter
    if (category_id) {
      includeConditions.push({
        model: Category,
        as: 'categories',
        where: { id: category_id },
      });
    } else {
      includeConditions.push({
        model: Category,
        as: 'categories',
      });
    }

    // Query blogs
    const { count, rows } = await Blog.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      distinct: true,
    });

    const categories = await Category.findAll({
      where: { type: 'category', parentId: null },
      include: [
        {
          model: Blog,
          as: 'blogs',
        },
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
      limit: 10,
      order: [['count', 'DESC']],
    });

    const stickyBlog = await Blog.findOne({
      where: {
        status: 'publish',
      },
      include: includeConditions,
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

    // Format response
    const blogs = rows.map((blog) => ({
      id: blog.id,
      title: blog.title,
      post_date: blog.createdAt,
      status: blog.status,
      description: blog.description,
      post_excerpt: blog.description?.substring(0, 150) + '...',
      numComments: blog.numComments,
      link: blog.link,
      image: blog.image
        ? {
            id: blog.image.id,
            full: { url: blog.image.full },
            thumb: { url: blog.image.thumb },
          }
        : undefined,
      author: blog.author
        ? {
            id: blog.author.id,
            name: blog.author.name,
            first_name: blog.author.firstName,
            last_name: blog.author.lastName,
            user_photo: blog.author.image,
          }
        : undefined,
      categories: blog.categories?.map((category) => ({
        term_id: category.id,
        name: category.title,
        taxonomy: category.type,
      })),
    }));

    res.status(200).json({
      success: true,
      data: blogs,
      categories: formattedCategories,
      sticky: {
        id: stickyBlog.id,
        title: stickyBlog.title,
        post_date: stickyBlog.createdAt,
        status: stickyBlog.status,
        description: stickyBlog.description,
        post_excerpt: stickyBlog.description?.substring(0, 150) + '...',
        numComments: stickyBlog.numComments,
        link: stickyBlog.link,
        image: stickyBlog.image
          ? {
              id: stickyBlog.image.id,
              full: { url: stickyBlog.image.full },
              thumb: { url: stickyBlog.image.thumb },
            }
          : undefined,
        author: stickyBlog.author
          ? {
              id: stickyBlog.author.id,
              name: stickyBlog.author.name,
              first_name: stickyBlog.author.firstName,
              last_name: stickyBlog.author.lastName,
              user_photo: stickyBlog.author.image,
            }
          : undefined,
        categories: stickyBlog.categories?.map((category) => ({
          term_id: category.id,
          name: category.title,
          taxonomy: category.type,
        })),
      },
      pagination: {
        page: Number.parseInt(page),
        per_page: limit,
        total: count,
        max_page: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message,
    });
  }
};

// Get blog details
const getBlogDetail = async (req, res) => {
  try {
    const { id } = req.query;

    const blog = await Blog.findByPk(id, {
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
            'description',
          ],
        },
        {
          model: Image,
          as: 'image',
        },
        {
          model: Category,
          as: 'categories',
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'image'],
            },
          ],
        },
      ],
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Get related blogs
    const relatedBlogs = await Blog.findAll({
      where: {
        id: { [Op.ne]: blog.id },
        status: 'publish',
      },
      include: [
        {
          model: Category,
          as: 'categories',
          where: {
            id: {
              [Op.in]: blog.categories.map((category) => category.id),
            },
          },
        },
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
      limit: 5,
    });

    // Format response
    const response = {
      id: blog.id,
      title: blog.title,
      post_date: blog.createdAt,
      status: blog.status,
      description: blog.description,
      numComments: blog.numComments,
      link: blog.link,
      image: blog.image
        ? {
            id: blog.image.id,
            full: { url: blog.image.full },
            thumb: { url: blog.image.thumb },
          }
        : undefined,
      author: blog.author
        ? {
            id: blog.author.id,
            name: blog.author.name,
            first_name: blog.author.firstName,
            last_name: blog.author.lastName,
            user_photo: blog.author.image,
            description: blog.author.description,
          }
        : undefined,
      categories: blog.categories?.map((category) => ({
        term_id: category.id,
        name: category.title,
        taxonomy: category.type,
      })),
      comments: blog.comments?.map((comment) => ({
        comment_ID: comment.id,
        comment_author: comment.user.name,
        comment_author_email: comment.user.email,
        comment_author_image: comment.user.image,
        comment_content: comment.content,
        comment_date: comment.createdAt,
        user_id: comment.user.id,
        rate: comment.rate,
      })),
      related: relatedBlogs.map((related) => ({
        id: related.id,
        post_title: related.title,
        post_date: related.createdAt,
        post_content: related.description?.substring(0, 150) + '...',
        comment_count: related.numComments,
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
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog details',
      error: error.message,
    });
  }
};

module.exports = {
  getBlogHome,
  getBlogDetail,
};
