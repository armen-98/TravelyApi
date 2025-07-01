const {
  Product,
  Category,
  User,
  Image,
  Location,
  Tag,
  Facility,
  Comment,
} = require('../../models');
const { Op } = require('sequelize');

// Get product listings
const getListings = async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 20,
      s: keyword,
      category,
      feature,
      location,
      price_min,
      price_max,
      color,
      status,
      orderby = 'createdAt',
      order = 'DESC',
    } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);

    // Build where conditions
    const whereConditions = {};

    if (keyword) {
      whereConditions.title = { [Op.like]: `%${keyword}%` };
    }

    if (price_min) {
      whereConditions.priceMin = { [Op.gte]: price_min };
    }

    if (price_max) {
      whereConditions.priceMax = { [Op.lte]: price_max };
    }

    if (color) {
      whereConditions.color = color;
    }

    if (status) {
      whereConditions.status = status;
    }

    // Build include conditions
    const includeConditions = [
      {
        model: User,
        as: 'author',
        attributes: [
          'id',
          'name',
          'firstName',
          'lastName',
          'image',
          'url',
          'level',
          'description',
          'tag',
          'rate',
        ],
      },
      {
        model: Image,
        as: 'image',
      },
      {
        model: Category,
        as: 'category',
      },
    ];

    // Add category filter
    if (category) {
      includeConditions.push({
        model: Category,
        as: 'category',
        where: { id: category },
      });
    }

    // Add feature filter
    if (feature) {
      includeConditions.push({
        model: Category,
        as: 'features',
        where: { id: feature },
      });
    }

    // Add location filter
    if (location) {
      includeConditions.push({
        model: Location,
        as: 'country',
        where: { id: location },
      });
    }

    // Query products
    const { count, rows } = await Product.findAndCountAll({
      where: whereConditions,
      include: includeConditions,
      order: [[orderby, order]],
      offset,
      limit,
      distinct: true,
    });

    // Format response
    const products = rows.map((product) => ({
      ID: product.id,
      post_title: product.title,
      post_date: product.createdAt,
      date_establish: product.dateEstablish,
      rating_avg: product.rate,
      rating_count: product.numRate,
      post_status: product.status,
      wishlist: false, // This would be determined by user's wishlist
      claim_use: product.useClaim,
      claim_verified: product.claimVerified,
      address: product.address,
      zip_code: product.zipCode,
      phone: product.phone,
      fax: product.fax,
      email: product.email,
      website: product.website,
      post_excerpt: product.description,
      color: product.color,
      icon: product.icon,
      price_min: product.priceMin,
      price_max: product.priceMax,
      booking_price_display: `${(+product.priceDisplay || 0).toFixed(2)}$`,
      booking_style: product.bookingStyle,
      latitude: product.latitude,
      longitude: product.longitude,
      guid: product.link,
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
            first_name: product.author.firstName,
            last_name: product.author.lastName,
            user_photo: product.author.image,
            user_url: product.author.url,
            user_level: product.author.level,
            description: product.author.description,
            tag: product.author.tag,
            rating_avg: product.author.rate,
          }
        : undefined,
      category: product.category
        ? {
            term_id: product.category.id,
            name: product.category.title,
            taxonomy: product.category.type,
          }
        : undefined,
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
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message,
    });
  }
};

// Get single product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
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
            'url',
            'level',
            'description',
            'tag',
            'rate',
          ],
        },
        {
          model: Image,
          as: 'image',
        },
        {
          model: Category,
          as: 'category',
        },
        {
          model: Location,
          as: 'country',
        },
        {
          model: Location,
          as: 'state',
        },
        {
          model: Location,
          as: 'city',
        },
        {
          model: Tag,
          as: 'tags',
        },
        {
          model: Facility,
          as: 'facilities',
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'firstName', 'lastName', 'image'],
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message,
    });
  }
};

// Approve product
const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.update({
      status: 'approved',
      adminNotes: adminNotes || product.adminNotes,
      approvedAt: new Date(),
      approvedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: 'Product approved successfully',
      data: {
        id: product.id,
        status: product.status,
        approvedAt: product.approvedAt,
      },
    });
  } catch (error) {
    console.error('Error approving product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve product',
      error: error.message,
    });
  }
};

// Reject product
const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, adminNotes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required',
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.update({
      status: 'rejected',
      rejectionReason: reason,
      adminNotes: adminNotes || product.adminNotes,
      rejectedAt: new Date(),
      rejectedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: 'Product rejected successfully',
      data: {
        id: product.id,
        status: product.status,
        rejectionReason: product.rejectionReason,
        rejectedAt: product.rejectedAt,
      },
    });
  } catch (error) {
    console.error('Error rejecting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject product',
      error: error.message,
    });
  }
};

// Update product status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = [
      'pending',
      'approved',
      'rejected',
      'suspended',
      'featured',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid status. Must be one of: pending, approved, rejected, suspended, featured',
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = {
      status,
      adminNotes: adminNotes || product.adminNotes,
    };

    // Add timestamp based on status
    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = req.user.id;
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
      updateData.rejectedBy = req.user.id;
    } else if (status === 'suspended') {
      updateData.suspendedAt = new Date();
      updateData.suspendedBy = req.user.id;
    }

    await product.update(updateData);

    res.status(200).json({
      success: true,
      message: `Product status updated to ${status}`,
      data: {
        id: product.id,
        status: product.status,
        updatedAt: product.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product status',
      error: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { force = false } = req.query;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (force === 'true') {
      // Hard delete
      await product.destroy({ force: true });
    } else {
      // Soft delete (if paranoid is enabled in model)
      await product.destroy();
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        id: product.id,
        title: product.title,
      },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    });
  }
};

// Get pending products
const getPendingProducts = async (req, res) => {
  try {
    const {
      page = 1,
      per_page = 20,
      orderby = 'createdAt',
      order = 'DESC',
    } = req.query;

    const offset = (page - 1) * per_page;
    const limit = Number.parseInt(per_page);

    const { count, rows } = await Product.findAndCountAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'firstName', 'lastName', 'image', 'email'],
        },
        {
          model: Category,
          as: 'category',
        },
        {
          model: Image,
          as: 'image',
        },
      ],
      order: [[orderby, order]],
      offset,
      limit,
    });

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: Number.parseInt(page),
        per_page: limit,
        total: count,
        max_page: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching pending products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending products',
      error: error.message,
    });
  }
};

// Get product statistics
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const pendingCount = await Product.count({ where: { status: 'pending' } });
    const approvedCount = await Product.count({
      where: { status: 'approved' },
    });
    const rejectedCount = await Product.count({
      where: { status: 'rejected' },
    });
    const suspendedCount = await Product.count({
      where: { status: 'suspended' },
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalProducts,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        suspended: suspendedCount,
      },
    });
  } catch (error) {
    console.error('Error fetching product statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product statistics',
      error: error.message,
    });
  }
};

// Bulk operations
const bulkUpdateStatus = async (req, res) => {
  try {
    const { productIds, status, adminNotes } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required',
      });
    }

    const validStatuses = [
      'pending',
      'approved',
      'rejected',
      'suspended',
      'featured',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const updateData = {
      status,
      adminNotes: adminNotes || null,
    };

    // Add timestamp based on status
    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedBy = req.user.id;
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
      updateData.rejectedBy = req.user.id;
    } else if (status === 'suspended') {
      updateData.suspendedAt = new Date();
      updateData.suspendedBy = req.user.id;
    }

    const [updatedCount] = await Product.update(updateData, {
      where: {
        id: { [Op.in]: productIds },
      },
    });

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} products to ${status}`,
      data: {
        updatedCount,
        status,
      },
    });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk update products',
      error: error.message,
    });
  }
};

// Bulk delete products
const bulkDeleteProducts = async (req, res) => {
  try {
    const { productIds, force = false } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required',
      });
    }

    const deletedCount = await Product.destroy({
      where: {
        id: { [Op.in]: productIds },
      },
      force: force,
    });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedCount} products`,
      data: {
        deletedCount,
      },
    });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bulk delete products',
      error: error.message,
    });
  }
};

module.exports = {
  getListings,
  getProduct,
  approveProduct,
  rejectProduct,
  updateProductStatus,
  deleteProduct,
  getPendingProducts,
  getProductStats,
  bulkUpdateStatus,
  bulkDeleteProducts,
};
