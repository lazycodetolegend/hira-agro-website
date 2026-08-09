const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice
} = require('../controllers/invoiceController');

router.route('/')
  .get(protect, getInvoices)
  .post(protect, authorize('admin', 'manager'), createInvoice);

router.route('/:id')
  .get(protect, getInvoiceById)
  .delete(protect, authorize('admin'), deleteInvoice);

module.exports = router;
