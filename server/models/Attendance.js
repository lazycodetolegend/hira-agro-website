const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
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
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day'],
    required: true
  }
}, { timestamps: true });

// Prevent duplicate attendance entries for same labourer on same date
attendanceSchema.index({ labourerId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
