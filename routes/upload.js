const express = require('express');
const { uploadMedia } = require('../controllers/upload');
const { verifyToken } = require('../middlewares/authMiddleware');
const multerMiddleware = require('../middlewares/multer');

const router = express.Router();

// Upload media
router.post('/media', verifyToken, multerMiddleware, uploadMedia);

module.exports = router;
