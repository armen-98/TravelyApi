const express = require('express');
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/role.js');
const { verifyToken } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/role.js');

const router = express.Router();

// Get all roles
router.get('/', verifyToken, isAdmin, getRoles);

// Get role by ID
router.get('/:id', verifyToken, isAdmin, getRoleById);

// Create role
router.post('/', verifyToken, isAdmin, createRole);

// Update role
router.put('/:id', verifyToken, isAdmin, updateRole);

// Delete role
router.delete('/:id', verifyToken, isAdmin, deleteRole);

module.exports = router;
