const express = require('express');

const { adminSignIn, enterAccount } = require('../../controllers/admin/auth');
const allowAdminRoles = require('../../middlewares/allowAdminRoles');

const { roles } = require('../../constants');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/sign-in', adminSignIn);
router.post(
  '/enter-account/:id',
  verifyToken,
  allowAdminRoles(roles.ADMIN),
  enterAccount,
);

module.exports = router;
