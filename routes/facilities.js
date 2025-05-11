const express = require('express');
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} = require('../controllers/facilities.js');
const { verifyToken } = require('../middlewares/authMiddleware');
const { hasPermission } = require('../middlewares/role');

const router = express.Router();

// Get all facilities
router.get('/', getFacilities);

// Get facility by ID
router.get('/:id', getFacilityById);

// Create facility
router.post(
  '/',
  verifyToken,
  hasPermission('facilities', 'create'),
  createFacility,
);

// Update facility
router.put(
  '/:id',
  verifyToken,
  hasPermission('facilities', 'update'),
  updateFacility,
);

// Delete facility
router.delete(
  '/:id',
  verifyToken,
  hasPermission('facilities', 'delete'),
  deleteFacility,
);

module.exports = router;
