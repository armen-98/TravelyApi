const express = require('express');
const {
  getCategories,
  getDiscoveryCategories,
  getSubcategories,
} = require('../controllers/category');

const router = express.Router();

router.get('/list', getCategories);

router.get('/list_discover', getDiscoveryCategories);

router.get('/:id/subcategories', getSubcategories);

module.exports = router;
