const express = require('express');
const { 
  getListings,
  getProduct,
  approveProduct,
  rejectProduct,
  updateProductStatus,
  deleteProduct,
  getPendingProducts,
  getProductStats,
  bulkUpdateStatus,
  bulkDeleteProducts,
} = require('../../controllers/admin/product.js');

const router = express.Router();

// Get product listings with filters
router.get('/', getListings);

// Get single product by ID
router.get('/:id', getProduct);

// Get pending products for review
router.get('/pending/list', getPendingProducts);

// Get product statistics
router.get('/stats/overview', getProductStats);

// Approve product
router.patch('/:id/approve', approveProduct);

// Reject product
router.patch('/:id/reject', rejectProduct);

// Update product status
router.patch('/:id/status', updateProductStatus);

// Delete product
router.delete('/:id', deleteProduct);

// Bulk operations
router.patch('/bulk/status', bulkUpdateStatus);
router.delete('/bulk/delete', bulkDeleteProducts);

module.exports = router;
