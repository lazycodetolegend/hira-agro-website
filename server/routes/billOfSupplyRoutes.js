const express = require('express');
const router = express.Router();
const billOfSupplyController = require('../controllers/billOfSupplyController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

router.route('/')
  .get(authorize('admin', 'manager'), billOfSupplyController.getBills)
  .post(authorize('admin', 'manager'), billOfSupplyController.createBill);

router.route('/:id')
  .get(authorize('admin', 'manager'), billOfSupplyController.getBillById)
  .delete(authorize('admin'), billOfSupplyController.deleteBill);

module.exports = router;
