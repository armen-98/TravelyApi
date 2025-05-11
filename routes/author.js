const express = require('express');
const {
  getAuthorListing,
  getAuthorInfo,
  getAuthorReviews,
} = require('../controllers/author');

const router = express.Router();

// Get author listings
router.get('/listing/:id', getAuthorListing);

// Get author info
router.get('/overview/:id', getAuthorInfo);

// Get author reviews
router.get('/comments/:id', getAuthorReviews);

module.exports = router;
