const express = require('express');

const { adminSignIn } = require('../../controllers/admin/auth');

const router = express.Router();

// Public routes
router.post('/sign-in', adminSignIn);

module.exports = router;
