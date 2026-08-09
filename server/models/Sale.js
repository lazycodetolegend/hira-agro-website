const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantitySold: {
    type: Number,
    required: true,
    min: 0.1
  },
  ratePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'due'],
    default: 'due'
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Sale', saleSchema);
