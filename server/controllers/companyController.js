const Company = require('../models/Company');

/**
 * @desc    Get all companies (super_admin) or user's company
 * @route   GET /api/companies
 * @access  Private
 */
const getCompanies = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'super_admin' && req.companyId) {
      query._id = req.companyId;
    }
    const companies = await Company.find(query);
    res.status(200).json({ companies, count: companies.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get single company details
 * @route   GET /api/companies/:id
 * @access  Private
 */
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    if (req.user.role !== 'super_admin' && req.companyId && req.companyId.toString() !== company._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this company' });
    }

    res.status(200).json({ company });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById
};
