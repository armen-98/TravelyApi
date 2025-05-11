const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require('../controllers/wishlist.js');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get wishlist
router.get('/list', verifyToken, getWishlist);

// Add to wishlist
router.post('/save', verifyToken, addToWishlist);

// Remove from wishlist
router.post('/remove', verifyToken, removeFromWishlist);

// Clear wishlist
router.post('/reset', verifyToken, clearWishlist);

module.exports = router;
