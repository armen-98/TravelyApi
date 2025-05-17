const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const sendEmail = require('../services/nodemiler').sendEmail;

/**
 * Authentication Service
 * Provides common authentication functions for users, admins, and moderators
 */
class AuthService {
  /**
   * Generate JWT token
   * @param {string} id - User/Admin/Moderator ID
   * @param {string} type - Token type ('user', 'admin', 'moderator')
   * @param {string} expiresIn - Token expiration time
   * @returns {string} JWT token
   */
  generateToken(id, type, expiresIn = '30d') {
    return jwt.sign({ id, type }, process.env.JWT_SECRET, {
      expiresIn,
    });
  }

  /**
   * Generate a secure 6-digit OTP and expiration time
   * @returns {Object} Object containing OTP and expiration time
   */
  generateOtp() {
    // Generate a secure random 6-digit number
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set expiration time to 10 minutes from now
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    return {
      otp,
      otpExpiration,
    };
  }

  /**
   * Hash password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Compare password with hashed password
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} True if passwords match
   */
  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Generate a random reset token
   * @returns {string} Reset token
   */
  generateResetToken() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Send password reset email
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.otp - One-time password
   * @param {Object} options.res - Response object for localization
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail({ email, otp, res }) {
    await sendEmail({
      to: email,
      subject: res.__('password_subject'),
      text: `${otp} - ${res.__('otp_sent_success')}`,
    });
  }

  /**
   * Send OTP verification email
   * @param {Object} options - Email options
   * @param {string} options.email - Recipient email
   * @param {string} options.otp - One-time password
   * @returns {Promise<void>}
   */
  async sendOtpEmail({ email, otp }) {
    await sendEmail({
      to: email,
      subject: 'Verify Your Account',
      text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <h1>Verify Your Account</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>It will expire in 10 minutes.</p>
      `,
    });
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @param {string} expectedType - Expected token type ('user', 'admin', 'moderator')
   * @returns {Object|null} Decoded token or null if invalid
   */
  verifyToken(token, expectedType) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== expectedType) {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthService();
