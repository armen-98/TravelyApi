const express = require('express');

const {
  adminSignIn,
  enterAccount,
  me,
} = require('../../controllers/admin/auth');
const allowAdminRoles = require('../../middlewares/allowAdminRoles');

const { roles, PERMISSION_ALL } = require('../../constants');
const { verifyToken } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/sign-in', adminSignIn);

// Privet routes
router.get('/me', verifyToken, allowAdminRoles(PERMISSION_ALL), me);
router.post(
  '/enter-account/:id',
  verifyToken,
  allowAdminRoles(roles.ADMIN),
  enterAccount,
);

module.exports = router;
