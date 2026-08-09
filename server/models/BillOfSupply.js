const mongoose = require('mongoose');

const billLineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hsnCode: { type: String, default: '' },
  qty: { type: Number, default: 0 },
  weightKg: { type: Number, default: 0 },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const billOfSupplySchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  billDate: {
    type: Date,
    default: Date.now
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerAddress: {
    type: String,
    default: ''
  },
  buyerGST: {
    type: String,
    default: ''
  },
  buyerStateCode: {
    type: String,
    default: ''
  },
  broker: {
    type: String,
    default: ''
  },
  vehicleNo: {
    type: String,
    default: ''
  },
  lineItems: [billLineItemSchema],
  total: {
    type: Number,
    required: true
  },
  amountInWords: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('BillOfSupply', billOfSupplySchema);
