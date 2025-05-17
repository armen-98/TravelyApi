const authService = require('../services/auth');
// const { Op } = require('sequelize');
const { Admin } = require('../models');
// const crypto = require('crypto');

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

// // Forgot password
// const adminForgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//
//     // Validate input
//     if (!email) {
//       return res.status(400).json({ message: 'Please provide email' });
//     }
//
//     // Find admin by email
//     const admin = await Admin.findOne({ where: { email } });
//     if (!admin) {
//       return res
//         .status(404)
//         .json({ message: 'Admin not found with this email' });
//     }
//
//     // Generate reset otp
//     const otp = crypto.randomInt(100000, 999999).toString();
//     const otpExpiration = new Date();
//     otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);
//     admin.otp = otp;
//     admin.otpExpiration = otpExpiration;
//     await admin.save();
//
//     // Send email
//     await authService.sendPasswordResetEmail({
//       email,
//       otp,
//       res,
//     });
//
//     res.status(200).json({
//       success: true,
//       message: 'Password reset link sent to your email',
//     });
//   } catch (error) {
//     console.error('Admin forgot password error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
//
// // Reset password
// const adminResetPassword = async (req, res) => {
//   try {
//     const { token, password } = req.body;
//
//     // Validate input
//     if (!token || !password) {
//       return res
//         .status(400)
//         .json({ message: 'Please provide token and new password' });
//     }
//
//     // Find admin by reset token
//     const admin = await Admin.findOne({
//       where: {
//         resetPasswordToken: token,
//         resetPasswordExpires: { [Op.gt]: new Date() },
//       },
//     });
//
//     if (!admin) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }
//
//     // Hash new password
//     const hashedPassword = await authService.hashPassword(password);
//
//     // Update password
//     admin.password = hashedPassword;
//     admin.resetPasswordToken = null;
//     admin.resetPasswordExpires = null;
//     await admin.save();
//
//     res.status(200).json({
//       success: true,
//       message: 'Password reset successfully',
//     });
//   } catch (error) {
//     console.error('Admin reset password error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };
//
// // Validate JWT token
// const validateAdminToken = async (req, res) => {
//   try {
//     const { token } = req.body;
//
//     if (!token) {
//       return res.status(400).json({ message: 'No token provided' });
//     }
//
//     // Verify token
//     const decoded = authService.verifyToken(token, 'admin');
//     if (!decoded) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//
//     // Check if admin exists
//     const admin = await Admin.findByPk(decoded.id, {
//       attributes: { exclude: ['password'] },
//     });
//
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//
//     if (admin.status !== 'active') {
//       return res.status(403).json({ message: 'Your account is inactive' });
//     }
//
//     res.status(200).json({
//       success: true,
//       message: 'Token is valid',
//       data: {
//         id: admin.id,
//         name: admin.name,
//         email: admin.email,
//         isSuperAdmin: admin.isSuperAdmin,
//         permissions: admin.permissions,
//         profileImage: admin.profileImage,
//       },
//     });
//   } catch (error) {
//     console.error('Validate admin token error:', error);
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ message: 'Token expired' });
//     }
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };
//
// // Change password
// const adminChangePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//
//     // Validate input
//     if (!currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .json({ message: 'Please provide current and new password' });
//     }
//
//     const admin = await Admin.findByPk(req.admin.id);
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//
//     // Check if current password is correct
//     const isMatch = await authService.comparePassword(
//       currentPassword,
//       admin.password,
//     );
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Current password is incorrect' });
//     }
//
//     // Hash new password
//     const hashedPassword = await authService.hashPassword(newPassword);
//
//     // Update password
//     admin.password = hashedPassword;
//     await admin.save();
//
//     res.status(200).json({
//       success: true,
//       message: 'Password changed successfully',
//     });
//   } catch (error) {
//     console.error('Admin change password error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

module.exports = {
  adminSignIn,
  // adminForgotPassword,
  // adminResetPassword,
  // validateAdminToken,
  // adminChangePassword,
};
