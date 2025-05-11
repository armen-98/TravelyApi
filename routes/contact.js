const express = require('express');
const { uploadMedia, sendEmailMessage } = require('../controllers/contact');
const { verifyToken } = require('../middlewares/authMiddleware');
const multerMiddleware = require('../middlewares/multer');

const router = express.Router();

router.post('/help-attachment', [verifyToken, multerMiddleware], uploadMedia);
router.post('/send-email', verifyToken, sendEmailMessage);

module.exports = router;
