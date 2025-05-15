const { Op } = require('sequelize');
const { User, Role } = require('../models');

const createAdmin = async (req, res) => {
  try {
    console.log('data');
    return res.status(200).json({
      data: {},
      message: 'Success',
    });
  } catch (e) {
    console.log('Catch for createAdmin', e);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit);

    // Build query
    const where = {};

    // Search by name or email
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Execute query with pagination
    const { rows: users, count: total } = await User.findAndCountAll({
      where,
      attributes: {
        exclude: [
          'password',
          'otpCode',
          'otpExpires',
          'resetPasswordToken',
          'resetPasswordExpires',
        ],
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name', 'description'],
        },
      ],
      order: [[sort, order === 'desc' ? 'DESC' : 'ASC']],
      offset,
      limit: Number.parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total,
        pages: Math.ceil(total / Number.parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

// Get user details (admin only)
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: {
        exclude: [
          'password',
          'otpCode',
          'otpExpires',
          'resetPasswordToken',
          'resetPasswordExpires',
        ],
      },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name', 'description'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user details error:', error);
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, isVerified } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (isVerified !== undefined) user.isVerified = Boolean(isVerified);

    await user.save();

    res.status(200).json({
      success: true,
      message: res.__('user_updated_successfully'),
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: res.__('not_found_user') });
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({
        message: res.__('cannot_delete_own_account_through_this_endpoint'),
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: res.__('user_deleted_successfully'),
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

module.exports = {
  createAdmin,
  getUsers,
  getUserDetails,
  updateUser,
  deleteUser,
};
