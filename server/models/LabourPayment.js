const mongoose = require('mongoose');

const labourPaymentSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  labourerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Labourer',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['advance', 'bonus', 'extra'],
    required: true
  },
  note: {
    type: String,
    trim: true,
    default: ''
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('LabourPayment', labourPaymentSchema);
