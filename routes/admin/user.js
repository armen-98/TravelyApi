const express = require('express');
const router = express.Router();

const adminController = require('../../controllers/admin/users');
const { isAdmin } = require('../../middlewares/admin.middleware');
const { verifyToken } = require('../../middlewares/authMiddleware');

// All routes require authentication and admin privileges
router.use(verifyToken);
router.use(isAdmin);

// User management routes
router.get('/', adminController.getUsers);
router.get('/:id', adminController.getUserDetails);
router.patch('/:id', adminController.updateUser);
router.delete('/:id', adminController.deleteUser);

module.exports = router;
