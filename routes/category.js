const express = require('express');
const {
  getCategories,
  getDiscoveryCategories,
  getSubcategories,
} = require('../controllers/category');

const router = express.Router();

// Get categories list
router.get('/list', getCategories);

// Get discovery categories
router.get('/list_discover', getDiscoveryCategories);

// Get subcategories for a specific category
router.get('/:id/subcategories', getSubcategories);

module.exports = router;
