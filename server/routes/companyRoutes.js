const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCompanies, getCompanyById } = require('../controllers/companyController');

// GET / — protected, returns companies based on role
router.route('/').get(protect, getCompanies);

// GET /:id — protected, returns single company
router.route('/:id').get(protect, getCompanyById);

module.exports = router;
