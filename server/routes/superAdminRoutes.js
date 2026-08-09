const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);
router.use(authorize('super_admin'));

router.get('/overview', superAdminController.getOverview);

module.exports = router;
