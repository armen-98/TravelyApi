const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/users');

const { verifyToken } = require('../../middlewares/authMiddleware');
const allowAdminRoles = require('../../middlewares/allowAdminRoles');
const { roles, PERMISSION_ALL } = require('../../constants');

// All routes require authentication and admin privileges
router.use(verifyToken);

// User management routes
router.get('/', allowAdminRoles(PERMISSION_ALL), adminController.getUsers);
router.get(
  '/:id',
  allowAdminRoles([roles.ADMIN]),
  adminController.getUserDetails,
);
router.patch(
  '/:id',
  allowAdminRoles([roles.ADMIN]),
  adminController.updateUser,
);
router.delete(
  '/:id',
  allowAdminRoles([roles.ADMIN]),
  adminController.deleteUser,
);

module.exports = router;
