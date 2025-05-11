const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  submitClaim,
  getClaimList,
  getClaimDetail,
  payClaim,
  cancelClaim,
  acceptClaim,
} = require('../controllers/claim');

const router = express.Router();

// Submit claim
router.post('/submit', verifyToken, submitClaim);

// Get claim list
router.get('/list', verifyToken, getClaimList);

// Get claim details
router.get('/view/:id', verifyToken, getClaimDetail);

// Pay claim
router.post('/pay/:id', verifyToken, payClaim);

// Cancel claim
router.post('/cancel_by_id/:id', verifyToken, cancelClaim);

// Accept claim
router.post('/accept_by_id/:id', verifyToken, acceptClaim);

module.exports = router;