const express = require('express');
const {
  getUser,
  updateUserProfile,
  uploadMedia,
  updateNotificationSetting,
} = require('../controllers/user.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const multerMiddleware = require('../middlewares/multer');

const router = express.Router();

router.get('/user', verifyToken, getUser);

router.post('/upload/media', [multerMiddleware, verifyToken], uploadMedia);
router.post('/update/profile', verifyToken, updateUserProfile);
router.post('/notification-setting', verifyToken, updateNotificationSetting);

module.exports = router;
