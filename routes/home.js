const express = require('express');
const { getHomeInit, getHomeWidget } = require('../controllers/home');

const router = express.Router();

// Get home initialization data
router.get('/init', getHomeInit);

// Get home widget data
router.get('/widget/:id', getHomeWidget);

module.exports = router;
