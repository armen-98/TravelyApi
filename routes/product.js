const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const {
  getListings,
  getProduct,
  saveProduct,
  deleteProduct,
  getProductForm,
} = require('../controllers/product.js');

const router = express.Router();

// Get product listings
router.get('/list', getListings);

router.get('/form', getProductForm);

// Get product details
router.get('/view/:id', getProduct);

// Save product
router.post('/save', verifyToken, saveProduct);

// Delete product
router.delete('/delete/:id', verifyToken, deleteProduct);

module.exports = router;
