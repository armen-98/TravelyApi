const express = require('express');

const {
  // adminForgotPassword,
  // adminResetPassword,
  adminSignIn,
  // validateAdminToken,
} = require('../controllers/admin-auth');

// import { verifyAdminToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/sign-in', adminSignIn);
// router.post('/forgot-password', adminForgotPassword);
// router.post('/reset-password', adminResetPassword);
// router.post('/validate-token', validateAdminToken);

// Protected routes
// router.post('/change-password', verifyAdminToken, adminChangePassword);

module.exports = router;
