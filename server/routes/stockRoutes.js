const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { addStock, getStockLogs } = require('../controllers/stockController');

router.route('/')
  .post(protect, authorize('admin', 'manager'), addStock)
  .get(protect, authorize('admin', 'manager'), getStockLogs);

module.exports = router;
