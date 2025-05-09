const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const multerMiddleware = require('../middlewares/multer');
const router = express.Router();

const adminRouter = require('./admin');
const authRouter = require('./auth');
const settingsRouter = require('./settings');
const customerRouter = require('./customer');
const contactController = require('../controlllers/contact');

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/settings', settingsRouter);
router.use('/customer', customerRouter);

// Contact us
router.post(
  '/contact/help-attachment',
  [verifyToken, multerMiddleware],
  contactController.uploadMedia,
);
router.post(
  '/contact/send-email',
  verifyToken,
  contactController.sendEmailMessage,
);

module.exports = router;
