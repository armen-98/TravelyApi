const express = require('express');
const { getLocations } = require('../controllers/location');

const router = express.Router();

// Get locations
router.get('/list', getLocations);

module.exports = router;
