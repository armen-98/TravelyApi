const express = require('express');
const {
  getPaymentSettings,
  confirmSubscription,
  failSubscription,
} = require('../controllers/payment');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get payment settings
router.get('/payment', getPaymentSettings);

// Subscription endpoints
router.post('/subscription/confirm', verifyToken, confirmSubscription);
router.post('/subscription/fail', verifyToken, failSubscription);

module.exports = router;
