const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    trim: true,
    default: ''
  },
  proprietor: {
    type: String,
    trim: true,
    default: ''
  },
  mobileNumbers: [{
    type: String,
    trim: true
  }],
  addresses: [{
    type: String,
    trim: true
  }],
  panNumber: {
    type: String,
    trim: true,
    default: ''
  },
  gstin: {
    type: String,
    trim: true,
    default: ''
  },
  state: {
    type: String,
    default: 'Maharashtra'
  },
  stateCode: {
    type: String,
    default: '27'
  },
  bankName: {
    type: String,
    trim: true,
    default: ''
  },
  bankBranch: {
    type: String,
    trim: true,
    default: ''
  },
  accountNumber: {
    type: String,
    trim: true,
    default: ''
  },
  ifscCode: {
    type: String,
    trim: true,
    default: ''
  },
  billType: {
    type: String,
    enum: ['gst_invoice', 'bill_of_supply'],
    required: true
  },
  jurisdiction: {
    type: String,
    default: 'Subject to Dahanu Jurisdiction'
  },
  paymentNote: {
    type: String,
    default: "Pay by NEFT/RTGS, Payee's A/c Cheque only"
  },
  terms: [{
    type: String
  }],
  gstDeclaration: {
    type: String,
    default: ''
  },
  invoicePrefix: {
    type: String,
    trim: true,
    uppercase: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
