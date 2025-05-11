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
    // Get widgets
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

    // Format response
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
      data: formattedWidgets,
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
