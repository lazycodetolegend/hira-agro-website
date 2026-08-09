const Expense = require('../models/Expense');

/**
 * @desc    Add a new expense
 * @route   POST /api/expenses
 * @access  Private (Admin/Manager)
 */
exports.addExpense = async (req, res) => {
  try {
    const { category, amount, note, date } = req.body;

    if (!category || amount === undefined) {
      return res.status(400).json({ message: 'Please provide category and amount' });
    }

    const expenseData = {
      category,
      amount,
      note,
      recordedBy: req.user._id,
      companyId: req.companyId
    };

    if (date) expenseData.date = new Date(date);

    const expense = await Expense.create(expenseData);

    res.status(201).json({ expense });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all expenses
 * @route   GET /api/expenses
 * @access  Private (Admin/Manager)
 */
exports.getExpenses = async (req, res) => {
  try {
    const query = {};

    if (req.companyId) {
      query.companyId = req.companyId;
    }

    if (req.user.role === 'manager') {
      query.recordedBy = req.user._id;
    }

    const { startDate, endDate, category } = req.query;

    if (category) query.category = category;

    // Use date field if it exists, else fallback to createdAt
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate('recordedBy', 'name email')
      .sort({ date: -1, createdAt: -1 });

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    res.status(200).json({
      count: expenses.length,
      totalExpenses,
      expenses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
