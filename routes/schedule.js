const express = require('express');
const {
  getWorkingSchedule,
  updateWorkingSchedule,
} = require('../controllers/schedule.js');
const { verifyToken } = require('../middlewares/authMiddleware');
const { hasPermission } = require('../middlewares/role');

const router = express.Router();

// Get working schedule for a product
router.get('/:productId', getWorkingSchedule);

// Update working schedule for a product
router.put(
  '/:productId',
  verifyToken,
  hasPermission('products', 'update'),
  updateWorkingSchedule,
);

module.exports = router;
