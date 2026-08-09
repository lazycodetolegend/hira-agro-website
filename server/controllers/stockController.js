const Product = require('../models/Product');
const StockLog = require('../models/StockLog');

/**
 * @desc    Add or remove stock
 * @route   POST /api/stock
 * @access  Private (Admin/Manager)
 */
exports.addStock = async (req, res) => {
  try {
    const { productId, changeAmount, type, note } = req.body;

    if (!productId || changeAmount === undefined || !type) {
      return res.status(400).json({ message: 'Please provide productId, changeAmount, and type' });
    }

    if (changeAmount <= 0) {
      return res.status(400).json({ message: 'Change amount must be greater than 0' });
    }

    if (type !== 'add' && type !== 'remove') {
      return res.status(400).json({ message: 'Type must be "add" or "remove"' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check company ownership
    if (product.companyId && req.companyId && product.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (type === 'remove') {
      if (product.stockQuantity < changeAmount) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.stockQuantity -= changeAmount;
    } else {
      product.stockQuantity += changeAmount;
    }

    await product.save();

    const stockLog = await StockLog.create({
      productId,
      changeAmount,
      type,
      note,
      updatedBy: req.user._id,
      companyId: req.companyId
    });

    res.status(201).json({
      stockLog,
      product: {
        _id: product._id,
        name: product.name,
        stockQuantity: product.stockQuantity
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get stock logs
 * @route   GET /api/stock
 * @access  Private (Admin/Manager)
 */
exports.getStockLogs = async (req, res) => {
  try {
    const query = {};
    
    if (req.companyId) {
      query.companyId = req.companyId;
    }

    if (req.user.role === 'manager') {
      query.updatedBy = req.user._id;
    }

    const { productId, type, startDate, endDate } = req.query;

    if (productId) query.productId = productId;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const stockLogs = await StockLog.find(query)
      .populate('productId', 'name variety')
      .populate('updatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: stockLogs.length,
      stockLogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
