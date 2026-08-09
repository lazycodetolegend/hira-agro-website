const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { recordSale, getSales, deleteSale } = require('../controllers/saleController');

router.route('/')
  .post(protect, authorize('admin', 'manager'), recordSale)
  .get(protect, authorize('admin', 'manager'), getSales);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteSale);

module.exports = router;
