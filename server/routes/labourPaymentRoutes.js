const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin', 'manager'));

router.route('/')
  .get(labourController.getPayments)
  .post(labourController.createPayment);

router.route('/:id')
  .delete(labourController.deletePayment);

module.exports = router;
