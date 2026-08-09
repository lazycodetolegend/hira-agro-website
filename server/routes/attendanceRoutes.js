const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin', 'manager'));

router.route('/')
  .get(labourController.getAttendance);

router.route('/bulk')
  .post(labourController.saveBulkAttendance);

router.route('/monthly')
  .get(labourController.getMonthlyAttendance);

module.exports = router;
