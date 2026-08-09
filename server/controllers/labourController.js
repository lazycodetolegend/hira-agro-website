const Labourer = require('../models/Labourer');
const Attendance = require('../models/Attendance');
const LabourPayment = require('../models/LabourPayment');

exports.getLabourers = async (req, res) => {
  try {
    const filter = { companyId: req.companyId };
    if (req.query.active !== undefined) {
      filter.active = req.query.active === 'true';
    }
    const labourers = await Labourer.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ labourers, count: labourers.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createLabourer = async (req, res) => {
  try {
    const { name, designation, phone, wageType, wageAmount, active } = req.body;
    if (!name || wageAmount === undefined) {
      return res.status(400).json({ message: 'Name and wage amount are required' });
    }

    const labourer = await Labourer.create({
      companyId: req.companyId,
      name,
      designation: designation || 'General Labour',
      phone: phone || '',
      wageType: wageType || 'daily',
      wageAmount: Number(wageAmount),
      active: active !== undefined ? active : true
    });

    res.status(201).json({ labourer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLabourer = async (req, res) => {
  try {
    const labourer = await Labourer.findOneAndUpdate(
      { _id: req.params.id, companyId: req.companyId },
      req.body,
      { new: true }
    );
    if (!labourer) {
      return res.status(404).json({ message: 'Labourer not found' });
    }
    res.status(200).json({ labourer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLabourer = async (req, res) => {
  try {
    const labourer = await Labourer.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    });

    if (!labourer) {
      return res.status(404).json({ message: 'Labourer not found' });
    }

    // Cascade delete attendance and payments for this labourer
    await Attendance.deleteMany({ labourerId: req.params.id, companyId: req.companyId });
    await LabourPayment.deleteMany({ labourerId: req.params.id, companyId: req.companyId });

    res.status(200).json({ message: 'Labourer and related records deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.saveBulkAttendance = async (req, res) => {
  try {
    const { date, entries } = req.body;
    if (!date || !entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: 'Date and entries array are required' });
    }

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const promises = entries.map(entry => {
      return Attendance.findOneAndUpdate(
        { labourerId: entry.labourerId, date: targetDate },
        { companyId: req.companyId, status: entry.status },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });

    await Promise.all(promises);
    res.status(200).json({ message: 'Attendance saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: 'Date is required' });

    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const attendance = await Attendance.find({
      companyId: req.companyId,
      date: { $gte: targetDate, $lt: nextDay }
    }).populate('labourerId', 'name designation wageType');

    res.status(200).json({ attendance, count: attendance.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    const { date, labourerId } = req.query;
    const filter = { companyId: req.companyId };

    if (labourerId) filter.labourerId = labourerId;
    if (date) {
      const targetDate = new Date(date);
      targetDate.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: targetDate, $lt: nextDay };
    }

    await Attendance.deleteMany(filter);
    res.status(200).json({ message: 'Attendance record(s) deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getMonthlyAttendance = async (req, res) => {
  try {
    const { month, year, labourerId } = req.query;
    if (!month || !year || !labourerId) {
      return res.status(400).json({ message: 'Month, year, and labourerId are required' });
    }

    const m = Number(month);
    const y = Number(year);
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const attendance = await Attendance.find({
      companyId: req.companyId,
      labourerId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    res.status(200).json({ attendance, count: attendance.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const { labourerId, amount, type, date, note } = req.body;
    if (!labourerId || !amount) {
      return res.status(400).json({ message: 'Labourer and amount are required' });
    }

    const payment = await LabourPayment.create({
      companyId: req.companyId,
      labourerId,
      amount: Number(amount),
      type: type || 'advance',
      date: date ? new Date(date) : new Date(),
      note: note || '',
      recordedBy: req.user?._id || req.user?.id
    });

    res.status(201).json({ payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const { labourerId, month, year } = req.query;
    const filter = { companyId: req.companyId };

    if (labourerId) filter.labourerId = labourerId;

    if (month && year) {
      const m = Number(month);
      const y = Number(year);
      const startDate = new Date(y, m - 1, 1);
      const endDate = new Date(y, m, 0, 23, 59, 59);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const payments = await LabourPayment.find(filter)
      .populate('labourerId', 'name designation')
      .sort({ date: -1 });

    res.status(200).json({ payments, count: payments.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const payment = await LabourPayment.findOneAndDelete({
      _id: req.params.id,
      companyId: req.companyId
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    res.status(200).json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getSalarySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const m = Number(month);
    const y = Number(year);
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const labourers = await Labourer.find({ companyId: req.companyId, active: true });

    const attendanceRecords = await Attendance.find({
      companyId: req.companyId,
      date: { $gte: startDate, $lte: endDate }
    });

    const paymentRecords = await LabourPayment.find({
      companyId: req.companyId,
      date: { $gte: startDate, $lte: endDate }
    });

    const summary = labourers.map(labourer => {
      const id = labourer._id.toString();

      const att = attendanceRecords.filter(a => a.labourerId && a.labourerId.toString() === id);
      const daysPresent = att.filter(a => a.status === 'present').length;
      const halfDays = att.filter(a => a.status === 'half-day').length;
      const daysAbsent = att.filter(a => a.status === 'absent').length;
      const totalWorkingDays = daysPresent + halfDays * 0.5;

      let grossSalary = 0;
      if (labourer.wageType === 'daily') {
        grossSalary = totalWorkingDays * labourer.wageAmount;
      } else if (labourer.wageType === 'monthly') {
        grossSalary = labourer.wageAmount;
      }

      const pays = paymentRecords.filter(p => p.labourerId && p.labourerId.toString() === id);
      const totalPayments = pays.reduce((sum, p) => sum + (p.amount || 0), 0);

      const netPayable = grossSalary - totalPayments;

      return {
        labourerId: id,
        labourerName: labourer.name,
        designation: labourer.designation || 'General Labour',
        wageType: labourer.wageType,
        wageAmount: labourer.wageAmount,
        daysPresent,
        halfDays,
        daysAbsent,
        totalWorkingDays,
        grossSalary,
        totalPayments,
        netPayable
      };
    });

    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
