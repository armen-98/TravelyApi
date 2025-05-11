const express = require('express');
const { getUser, updateUserProfile } = require('../controllers/user.js');
const { verifyToken } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/user', verifyToken, getUser);

router.post('/update/profile', verifyToken, updateUserProfile);

module.exports = router;
