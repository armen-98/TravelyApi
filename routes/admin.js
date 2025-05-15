const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');
const { isAdmin } = require('../middlewares/admin.middleware');
const { verifyToken } = require('../middlewares/authMiddleware');

// All routes require authentication and admin privileges
router.use(verifyToken);
router.use(isAdmin);

router.post('/admin', adminController.createAdmin);
// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
