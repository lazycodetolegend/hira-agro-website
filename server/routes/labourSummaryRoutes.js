const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin', 'manager'));

router.route('/salary-summary')
  .get(labourController.getSalarySummary);

module.exports = router;
