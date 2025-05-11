const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { getComments, saveComment } = require('../controllers/comment');

const router = express.Router();

// Get comments
router.get('/', getComments);

// Save comment
router.post('/', verifyToken, saveComment);

module.exports = router;