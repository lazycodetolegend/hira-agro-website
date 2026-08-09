const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { addExpense, getExpenses } = require('../controllers/expenseController');

router.route('/')
  .post(protect, authorize('admin', 'manager'), addExpense)
  .get(protect, authorize('admin', 'manager'), getExpenses);

module.exports = router;
