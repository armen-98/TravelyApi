const express = require('express');
const router = express.Router();

const customerController = require('../controlllers/customer');
const multerMiddleware = require('../middlewares/multer');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post(
  '/upload/media',
  [verifyToken, multerMiddleware],
  customerController.uploadMedia,
);

router.post(
  '/update/profile',
  verifyToken,
  customerController.updateUserProfile,
);

module.exports = router;
