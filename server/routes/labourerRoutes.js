const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('admin', 'manager'));

router.route('/')
  .get(labourController.getLabourers)
  .post(labourController.createLabourer);

router.route('/:id')
  .put(labourController.updateLabourer)
  .delete(labourController.deleteLabourer);

module.exports = router;
