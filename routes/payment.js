const express = require('express');
const { getPaymentSettings } = require('../controllers/payment');

const router = express.Router();

// Get payment settings
router.get('/payment', getPaymentSettings);

module.exports = router;
