const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
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
  changeAmount: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['add', 'remove'],
    required: true
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StockLog', stockLogSchema);
