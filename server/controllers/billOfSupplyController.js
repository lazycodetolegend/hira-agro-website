const BillOfSupply = require('../models/BillOfSupply');
const Company = require('../models/Company');

const numberToWordsIndian = (num) => {
  const amount = Math.round(Number(num) || 0);
  if (amount === 0) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  function inWords(n) {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }
  return `${inWords(amount)} Rupees Only`;
};

exports.getBills = async (req, res) => {
  try {
    const filter = { companyId: req.companyId };

    if (req.query.search) {
      filter.$or = [
        { billNumber: new RegExp(req.query.search, 'i') },
        { buyerName: new RegExp(req.query.search, 'i') }
      ];
    }

    if (req.query.startDate && req.query.endDate) {
      filter.billDate = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const bills = await BillOfSupply.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ bills, count: bills.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getBillById = async (req, res) => {
  try {
    const bill = await BillOfSupply.findOne({ _id: req.params.id, companyId: req.companyId });
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json({ bill });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.createBill = async (req, res) => {
  try {
    let prefix = 'BILL';
    if (req.companyId) {
      const company = await Company.findById(req.companyId);
      if (company && company.invoicePrefix) {
        prefix = company.invoicePrefix;
      }
    }

    const count = await BillOfSupply.countDocuments({ companyId: req.companyId });
    const sequenceNumber = (count + 1).toString().padStart(4, '0');
    const year = new Date().getFullYear();
    const billNumber = `${prefix}-${year}-${sequenceNumber}`;

    let total = 0;
    const lineItems = (req.body.lineItems || []).map(item => {
      const weight = Number(item.weightKg) || 0;
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const multiplier = weight > 0 ? weight : (qty > 0 ? qty : 1);
      const amount = multiplier * rate;
      total += amount;
      return {
        description: item.description,
        hsnCode: item.hsnCode || '1006',
        qty,
        weightKg: weight,
        rate,
        amount
      };
    });

    const amountInWords = numberToWordsIndian(total);

    const bill = await BillOfSupply.create({
      ...req.body,
      companyId: req.companyId,
      billNumber,
      lineItems,
      total,
      amountInWords,
      createdBy: req.user?._id || req.user?.id
    });

    res.status(201).json({ bill });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await BillOfSupply.findOneAndDelete({ _id: req.params.id, companyId: req.companyId });
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    res.status(200).json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
