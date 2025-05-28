const express = require('express');
const { getBlogHome, getBlogDetail } = require('../controllers/blog');

const router = express.Router();

// Get blog home data
router.get('/home', getBlogHome);

// Get blog details
router.get('/view', getBlogDetail);

module.exports = router;
