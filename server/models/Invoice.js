const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  hsnCode: { type: String, default: '1006' },
  gstPercent: { type: Number, default: 5 },
  qty: { type: Number, required: true },
  unit: { type: String, default: 'm.t.' },
  rate: { type: Number, required: true },
  taxableValue: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceDate: {
    type: Date,
    default: Date.now
  },
  poNumber: String,
  poDate: Date,
  eWayBillNo: String,
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerAddress: {
    type: String,
    required: true
  },
  buyerGSTIN: {
    type: String,
    default: ''
  },
  buyerState: {
    type: String,
    default: 'Maharashtra'
  },
  buyerStateCode: {
    type: String,
    default: '27'
  },
  lineItems: [lineItemSchema],
  transporterName: String,
  vehicleNo: String,
  placeOfSupply: String,
  totalTaxableValue: {
    type: Number,
    required: true
  },
  cgstPercent: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstPercent: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstPercent: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  roundOff: { type: Number, default: 0 },
  totalInvoiceValue: {
    type: Number,
    required: true
  },
  amountInWords: {
    type: String,
    required: true
  },
  linkedSaleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
