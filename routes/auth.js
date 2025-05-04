const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

const authController = require('../controlllers/auth');

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/jwt/token/validate', authController.tokenValidate);
router.get('/user', verifyToken, authController.getAuthUser);

module.exports = router;
