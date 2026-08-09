const Invoice = require('../models/Invoice');
const Sale = require('../models/Sale');
const Company = require('../models/Company');

// Number to Words function (Indian Numbering System)
const numberToWordsIndian = (num) => {
  const amount = Math.round(num);
  if (amount === 0) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
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

// Helper to generate auto-incrementing Invoice Number: PREFIX-2026-0001
const generateInvoiceNumber = async (prefixBase) => {
  const year = new Date().getFullYear();
  const prefix = `${prefixBase}-${year}-`;
  const lastInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ createdAt: -1 });

  if (!lastInvoice) {
    return `${prefix}0001`;
  }

  const parts = lastInvoice.invoiceNumber.split('-');
  const lastSeq = parseInt(parts[parts.length - 1], 10) || 0;
  const nextSeq = String(lastSeq + 1).padStart(4, '0');
  return `${prefix}${nextSeq}`;
};

// GET /api/invoices - Get all invoices (Admin/Manager)
const getInvoices = async (req, res) => {
  try {
    const { search, startDate, endDate } = req.query;
    let query = {};

    if (req.companyId) {
      query.companyId = req.companyId;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: new RegExp(search, 'i') },
        { buyerName: new RegExp(search, 'i') }
      ];
    }

    if (startDate || endDate) {
      query.invoiceDate = {};
      if (startDate) query.invoiceDate.$gte = new Date(startDate);
      if (endDate) query.invoiceDate.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .populate('createdBy', 'name')
      .populate('linkedSaleId')
      .sort({ createdAt: -1 });

    res.status(200).json({ invoices, count: invoices.length });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// GET /api/invoices/:id - Get single invoice
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('linkedSaleId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.companyId && invoice.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// POST /api/invoices - Create Invoice
const createInvoice = async (req, res) => {
  try {
    const {
      poNumber,
      poDate,
      eWayBillNo,
      buyerName,
      buyerAddress,
      buyerGSTIN,
      buyerState = 'Maharashtra',
      buyerStateCode = '27',
      lineItems = [],
      transporterName,
      vehicleNo,
      placeOfSupply,
      linkedSaleId
    } = req.body;

    if (!buyerName || !buyerAddress || !lineItems || lineItems.length === 0) {
      return res.status(400).json({ message: 'Buyer details and at least one line item are required' });
    }

    // Lookup company invoice prefix
    let invoicePrefixBase = 'HAI'; // Fallback
    if (req.companyId) {
      const company = await Company.findById(req.companyId);
      if (company && company.invoicePrefix) {
        invoicePrefixBase = company.invoicePrefix;
      }
    }

    // Auto-calculate line item taxable values
    let totalTaxableValue = 0;
    let maxGstRate = 0;

    const processedItems = lineItems.map(item => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const taxableValue = qty * rate;
      totalTaxableValue += taxableValue;

      const gst = Number(item.gstPercent) || 5;
      if (gst > maxGstRate) maxGstRate = gst;

      return {
        description: item.description,
        hsnCode: item.hsnCode || '1006',
        gstPercent: gst,
        qty,
        unit: item.unit || 'm.t.',
        rate,
        taxableValue
      };
    });

    // Tax Split Logic:
    let cgstPercent = 0, cgstAmount = 0;
    let sgstPercent = 0, sgstAmount = 0;
    let igstPercent = 0, igstAmount = 0;

    const effectiveGstRate = maxGstRate || 5;

    if (String(buyerStateCode).trim() === '27') {
      cgstPercent = effectiveGstRate / 2;
      sgstPercent = effectiveGstRate / 2;
      cgstAmount = (totalTaxableValue * cgstPercent) / 100;
      sgstAmount = (totalTaxableValue * sgstPercent) / 100;
    } else {
      igstPercent = effectiveGstRate;
      igstAmount = (totalTaxableValue * igstPercent) / 100;
    }

    const rawTotal = totalTaxableValue + cgstAmount + sgstAmount + igstAmount;
    const roundedTotal = Math.round(rawTotal);
    const roundOff = Number((roundedTotal - rawTotal).toFixed(2));
    const totalInvoiceValue = roundedTotal;
    const amountInWords = numberToWordsIndian(totalInvoiceValue);

    const invoiceNumber = await generateInvoiceNumber(invoicePrefixBase);

    const invoice = await Invoice.create({
      invoiceNumber,
      poNumber,
      poDate: poDate || null,
      eWayBillNo,
      buyerName,
      buyerAddress,
      buyerGSTIN,
      buyerState,
      buyerStateCode,
      lineItems: processedItems,
      transporterName,
      vehicleNo,
      placeOfSupply: placeOfSupply || buyerState,
      totalTaxableValue,
      cgstPercent,
      cgstAmount,
      sgstPercent,
      sgstAmount,
      igstPercent,
      igstAmount,
      roundOff,
      totalInvoiceValue,
      amountInWords,
      linkedSaleId: linkedSaleId || null,
      createdBy: req.user._id,
      companyId: req.companyId
    });

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// DELETE /api/invoices/:id - Admin only
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.companyId && invoice.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await invoice.deleteOne();
    res.status(200).json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice
};
