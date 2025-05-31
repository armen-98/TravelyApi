const express = require('express');
const {
  getAuthorListing,
  getAuthorInfo,
  getAuthorReviews,
} = require('../controllers/author');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get author listings
router.get('/listing', verifyToken, getAuthorListing);

// Get author info
router.get('/overview/:id', verifyToken, getAuthorInfo);

// Get author reviews
router.get('/comment', verifyToken, getAuthorReviews);

module.exports = router;
