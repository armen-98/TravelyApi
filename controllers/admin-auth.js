const authService = require('../services/auth');
const { Admin } = require('../models');

// Admin sign in
const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return res.status(403).json({
        message: 'Your account is inactive. Please contact a super admin.',
      });
    }

    // Check if password matches
    const isMatch = await authService.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
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
  } catch (error) {
    console.error('Admin sign in error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  adminSignIn,
};
