const express = require('express');
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require('../controllers/tags.js');
const { verifyToken } = require('../middlewares/authMiddleware');
const { hasPermission } = require('../middlewares/role');

const router = express.Router();

// Get all tags
router.get('/', getTags);

// Get tag by ID
router.get('/:id', getTagById);

// Create tag
router.post('/', verifyToken, hasPermission('tags', 'create'), createTag);

// Update tag
router.put('/:id', verifyToken, hasPermission('tags', 'update'), updateTag);

// Delete tag
router.delete('/:id', verifyToken, hasPermission('tags', 'delete'), deleteTag);

module.exports = router;
