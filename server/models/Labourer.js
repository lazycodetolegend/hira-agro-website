const mongoose = require('mongoose');

const labourerSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    trim: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  wageType: {
    type: String,
    enum: ['daily', 'monthly'],
    required: true
  },
  wageAmount: {
    type: Number,
    required: true,
    min: 0
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Labourer', labourerSchema);
