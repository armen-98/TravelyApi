const {
  Widget,
  Banner,
  Product,
  Category,
  Blog,
  Image,
  User,
} = require('../models');

// Get home initialization data
const getHomeInit = async (req, res) => {
  try {
    // Get sliders (banners)
    const sliders = await Banner.findAll({
      where: { type: 'slider' },
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
      limit: 5,
      order: [['id', 'DESC']],
    });

    // Get categories
    const categories = await Category.findAll({
      where: { type: 'category', parentId: null },
      include: [
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

    // Get locations
    const locations = await Category.findAll({
      where: { type: 'location' },
      include: [
        {
          model: Image,
          as: 'image',
        },
      ],
      limit: 10,
      order: [['count', 'DESC']],
    });

    // Get recent posts (products)
    const recentPosts = await Product.findAll({
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
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    const relatedBlogs = await Blog.findAll({
      where: {
        status: 'publish',
      },
      include: [
        {
          model: Category,
          as: 'categories',
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
    const formattedSliders = sliders.map((slider) =>
      slider.image ? slider.image.full : '',
    );

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
      has_child: category.subcategories && category.subcategories.length > 0,
      children: category.subcategories
        ? category.subcategories.map((sub) => ({
            term_id: sub.id,
            name: sub.title,
            count: sub.count,
            image: sub.image
              ? {
                  id: sub.image.id,
                  full: { url: sub.image.full },
                  thumb: { url: sub.image.thumb },
                }
              : undefined,
            icon: sub.icon,
            color: sub.color,
            taxonomy: sub.type,
            has_child: false,
          }))
        : [],
    }));

    const formattedLocations = locations.map((location) => ({
      term_id: location.id,
      name: location.title,
      count: location.count,
      image: location.image
        ? {
            id: location.image.id,
            full: { url: location.image.full },
            thumb: { url: location.image.thumb },
          }
        : undefined,
      icon: location.icon,
      color: location.color,
      taxonomy: location.type,
      has_child: false,
    }));

    const formattedRecentPosts = recentPosts.map((product) => ({
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
    }));

    // Get widgets for additional data
    const widgets = await Widget.findAll({
      order: [['position', 'ASC']],
      include: [
        {
          model: Banner,
          as: 'banners',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
        {
          model: Product,
          as: 'products',
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
        {
          model: Category,
          as: 'categories',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
        {
          model: Blog,
          as: 'blogs',
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

    const formattedNews = relatedBlogs.map((blog) => ({
      ID: blog.id,
      post_title: blog.title,
      post_date: blog.createdAt,
      post_status: blog.status,
      post_content: blog.description,
      comment_count: blog.numComments,
      guid: blog.link,
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
        ID: related.id,
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
    }));

    // Format widgets
    const formattedWidgets = widgets.map((widget) => {
      const baseWidget = {
        title: widget.title,
        description: widget.description,
        hide_title: !widget.title,
        hide_desc: !widget.description,
        type: widget.type,
        direction: widget.direction,
        layout: widget.layout,
      };

      // Format data based on widget type
      switch (widget.type) {
        case 'banner':
          return {
            ...baseWidget,
            data: widget.banners.map((banner) => ({
              url: banner.link,
              image: banner.image
                ? {
                    id: banner.image.id,
                    full: { url: banner.image.full },
                    thumb: { url: banner.image.thumb },
                  }
                : undefined,
            })),
          };

        case 'slider':
          return {
            ...baseWidget,
            data: widget.banners.map((banner) => ({
              url: banner.link,
              image: banner.image
                ? {
                    id: banner.image.id,
                    full: { url: banner.image.full },
                    thumb: { url: banner.image.thumb },
                  }
                : undefined,
            })),
          };

        case 'listing':
          return {
            ...baseWidget,
            data: widget.products.map((product) => ({
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
              author: product.author
                ? {
                    id: product.author.id,
                    name: product.author.name,
                    user_photo: product.author.image,
                  }
                : undefined,
            })),
          };

        case 'category':
          return {
            ...baseWidget,
            data: widget.categories.map((category) => ({
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
            })),
          };

        case 'post':
          return {
            ...baseWidget,
            data: widget.blogs.map((blog) => ({
              ID: blog.id,
              post_title: blog.title,
              post_date: blog.createdAt,
              post_content: blog.description,
              comment_count: blog.numComments,
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
                    user_photo: blog.author.image,
                  }
                : undefined,
            })),
          };

        default:
          return baseWidget;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        sliders: formattedSliders,
        categories: formattedCategories,
        locations: formattedLocations,
        recent_posts: formattedRecentPosts,
        widgets: formattedWidgets,
        news: formattedNews,
      },
    });
  } catch (error) {
    console.error('Error fetching home data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch home data',
      error: error.message,
    });
  }
};

// Get home widget data
const getHomeWidget = async (req, res) => {
  try {
    const { id } = req.params;

    const widget = await Widget.findByPk(id, {
      include: [
        {
          model: Banner,
          as: 'banners',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
        {
          model: Product,
          as: 'products',
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
        {
          model: Category,
          as: 'categories',
          include: [
            {
              model: Image,
              as: 'image',
            },
          ],
        },
        {
          model: Blog,
          as: 'blogs',
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

    if (!widget) {
      return res.status(404).json({
        success: false,
        message: 'Widget not found',
      });
    }

    // Format response based on widget type
    const baseWidget = {
      title: widget.title,
      description: widget.description,
      hide_title: !widget.title,
      hide_desc: !widget.description,
      type: widget.type,
      direction: widget.direction,
      layout: widget.layout,
    };

    let formattedWidget;

    switch (widget.type) {
      case 'banner':
        formattedWidget = {
          ...baseWidget,
          data: widget.banners.map((banner) => ({
            url: banner.link,
            image: banner.image
              ? {
                  id: banner.image.id,
                  full: { url: banner.image.full },
                  thumb: { url: banner.image.thumb },
                }
              : undefined,
          })),
        };
        break;

      case 'slider':
        formattedWidget = {
          ...baseWidget,
          data: widget.banners.map((banner) => ({
            url: banner.link,
            image: banner.image
              ? {
                  id: banner.image.id,
                  full: { url: banner.image.full },
                  thumb: { url: banner.image.thumb },
                }
              : undefined,
          })),
        };
        break;

      case 'listing':
        formattedWidget = {
          ...baseWidget,
          data: widget.products.map((product) => ({
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
            author: product.author
              ? {
                  id: product.author.id,
                  name: product.author.name,
                  user_photo: product.author.image,
                }
              : undefined,
          })),
        };
        break;

      case 'category':
        formattedWidget = {
          ...baseWidget,
          data: widget.categories.map((category) => ({
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
          })),
        };
        break;

      case 'post':
        formattedWidget = {
          ...baseWidget,
          data: widget.blogs.map((blog) => ({
            ID: blog.id,
            post_title: blog.title,
            post_date: blog.createdAt,
            post_content: blog.description,
            comment_count: blog.numComments,
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
                  user_photo: blog.author.image,
                }
              : undefined,
          })),
        };
        break;

      default:
        formattedWidget = baseWidget;
    }

    res.status(200).json({
      success: true,
      data: formattedWidget,
    });
  } catch (error) {
    console.error('Error fetching widget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch widget',
      error: error.message,
    });
  }
};

module.exports = {
  getHomeInit,
  getHomeWidget,
};
