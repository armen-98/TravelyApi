const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware.js');
const {
  getListings,
  getProduct,
  saveProduct,
  deleteProduct,
  getProductForm,
  uploadMedia,
} = require('../controllers/product.js');
const multerMiddleware = require('../middlewares/multer');

const router = express.Router();

router.get('/list', getListings);

router.get('/form', getProductForm);

router.get('/view', getProduct);

router.post('/save', verifyToken, saveProduct);

router.delete('/delete/:id', verifyToken, deleteProduct);
router.post('/image', [verifyToken, multerMiddleware], uploadMedia);

module.exports = router;
