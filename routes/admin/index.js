const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/authMiddleware');
const allowAdminRoles = require('../../middlewares/allowAdminRoles');
const { roles } = require('../../constants');

const authRouter = require('./auth');
const usersRouter = require('./user');
const productsRouter = require('./product');

router.use('/auth', authRouter);

// Apply authentication and authorization middleware to all admin routes
router.use(verifyToken);
router.use(allowAdminRoles([roles.ADMIN, roles.MODERATOR]));

router.use('/users', usersRouter);
router.use('/products', productsRouter);

module.exports = router;
