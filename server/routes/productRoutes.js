const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), upload.single('photo'), createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), upload.single('photo'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
