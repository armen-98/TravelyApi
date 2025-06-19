const authService = require('../../services/auth');
const { Admin, User, Role } = require('../../models');
const { sendErrorEmail } = require('../../services/nodemiler');
const { roles } = require('../../constants');

// Admin sign in
const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: res.__('provide_email_and_password') });
    }

    // Find admin by email
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Admin,
          as: 'admin',
        },
        {
          model: Role,
          as: 'role',
          attributes: ['name', 'description'],
        },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: res.__('invalid_email_or_password') });
    }

    // Check if admin is active
    if (!user.isActive) {
      return res.status(403).json({
        message: res.__('account_is_inactive'),
      });
    }

    // Check if password matches
    const isMatch = await authService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: res.__('invalid_password') });
    }

    // Generate token
    const token = authService.generateToken(user.id, 'admin', '1d');

    // Return admin data and token
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        isSuperAdmin: user.admin?.isSuperAdmin,
        image: user.image,
        role: user.role.name,
      },
      token,
    });
  } catch (e) {
    console.log('Catch error for admin signIn', e);
    if (process.env.NODE_ENV !== 'development') {
      await sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

const enterAccount = async (req, res) => {
  try {
    const { id } = req.params;

    if (!+id) {
      return res.status(400).json({ message: 'Provide valid id' });
    }

    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['name', 'description'],
        },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: res.__('not found user') });
    }

    if (user.role.name === roles.USER || user.role.name === roles.BUSINESS) {
      return res.status(403).json({
        message: 'Access denied. Users cannot enter other accounts.',
      });
    } else if (
      req.user.role.name === roles.SUPER_ADMIN &&
      user.role.name === roles.SUPER_ADMIN
    ) {
      return res.status(403).json({
        message:
          'Access denied. Super admins cannot enter super admin accounts.',
      });
    } else if (
      req.user.role.name === roles.ADMIN &&
      (user.role.name === roles.SUPER_ADMIN || user.role.name === roles.ADMIN)
    ) {
      return res.status(403).json({
        message:
          'Access denied. Admin cannot enter super admin or or other admin accounts.',
      });
    }

    const token = authService.generateToken(user.id, 'admin', '1d');

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role.name,
      },
      token,
    });
  } catch (e) {
    console.log('Catch error for enter account', e);
    if (process.env.NODE_ENV !== 'development') {
      await sendErrorEmail(e);
    }
    return res.status(500).json({
      message: res.__('internal_error'),
    });
  }
};

module.exports = {
  adminSignIn,
  enterAccount,
};
