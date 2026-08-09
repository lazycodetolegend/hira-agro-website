const Product = require('../models/Product');
const Sale = require('../models/Sale');

/**
 * @desc    Record a new sale
 * @route   POST /api/sales
 * @access  Private (Admin/Manager)
 */
exports.recordSale = async (req, res) => {
  try {
    const { productId, quantitySold, ratePerUnit, buyerName, paymentStatus } = req.body;

    if (!productId || !quantitySold || !ratePerUnit || !buyerName || !paymentStatus) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stockQuantity < quantitySold) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const totalAmount = quantitySold * ratePerUnit;

    product.stockQuantity -= quantitySold;
    await product.save();

    let sale = await Sale.create({
      productId,
      quantitySold,
      ratePerUnit,
      totalAmount,
      buyerName,
      paymentStatus,
      recordedBy: req.user._id,
      companyId: req.companyId
    });

    sale = await sale.populate('productId', 'name');

    res.status(201).json({ sale });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get all sales
 * @route   GET /api/sales
 * @access  Private (Admin/Manager)
 */
exports.getSales = async (req, res) => {
  try {
    const query = {};

    if (req.companyId) {
      query.companyId = req.companyId;
    }

    if (req.user.role === 'manager') {
      query.recordedBy = req.user._id;
    }

    const { startDate, endDate, paymentStatus, productId } = req.query;

    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (productId) query.productId = productId;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const sales = await Sale.find(query)
      .populate('productId', 'name variety ratePerKg')
      .populate('recordedBy', 'name email')
      .sort({ createdAt: -1 });

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);

    res.status(200).json({
      count: sales.length,
      totalRevenue,
      sales
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Delete a sale record
 * @route   DELETE /api/sales/:id
 * @access  Private (Admin only)
 */
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    if (sale.companyId && sale.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this sale' });
    }

    // Restore stock
    if (sale.productId) {
      const product = await Product.findById(sale.productId);
      if (product) {
        product.stockQuantity += sale.quantitySold;
        await product.save();
      }
    }

    await sale.deleteOne();

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
