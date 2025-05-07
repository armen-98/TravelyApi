const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

const authController = require('../controlllers/auth');

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/jwt/token/validate', verifyToken, authController.tokenValidate);
router.get('/user', verifyToken, authController.getAuthUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend/otp', authController.forgotPassword);
router.post('/change-password', authController.changePassword);
router.post(
  '/deactivate-account',
  verifyToken,
  authController.deactivateAccount,
);

module.exports = router;
