const authService = require('../../services/auth');
const { Admin } = require('../../models');
const { sendErrorEmail } = require('../../services/nodemiler');

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
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res
        .status(401)
        .json({ message: res.__('invalid_email_or_password') });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(403).json({
        message: res.__('account_is_inactive'),
      });
    }

    // Check if password matches
    const isMatch = await authService.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: res.__('invalid_password') });
    }

    // Update last login time
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate token
    const token = authService.generateToken(admin.id, 'admin', '1d');

    // Return admin data and token
    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isSuperAdmin: admin.isSuperAdmin,
        profileImage: admin.profileImage,
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

module.exports = {
  adminSignIn,
};
