const Company = require('../models/Company');
const Labourer = require('../models/Labourer');
const LabourPayment = require('../models/LabourPayment');
const BillOfSupply = require('../models/BillOfSupply');
const Sale = require('../models/Sale');
const Invoice = require('../models/Invoice');

exports.getOverview = async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const companyStats = [];

    let totalRevenueAllTimeAll = 0;
    let totalRevenueThisMonthAll = 0;
    let totalActiveLabourersAll = 0;
    let totalLabourPaymentsThisMonthAll = 0;

    for (const company of companies) {
      const companyId = company._id;

      // 1. Sales & Bills Revenue
      const allSales = await Sale.find({ companyId });
      const allBills = await BillOfSupply.find({ companyId });
      const allInvoices = await Invoice.find({ companyId });

      const salesRevenue = allSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      const billsRevenue = allBills.reduce((sum, b) => sum + (b.total || 0), 0);
      const invoicesRevenue = allInvoices.reduce((sum, inv) => sum + (inv.totalInvoiceValue || 0), 0);

      // Total revenue (using max of sales or invoices/bills to avoid double counting linked sales)
      const totalRevenueAllTime = Math.max(salesRevenue, billsRevenue + invoicesRevenue) || salesRevenue || billsRevenue || 0;

      // Monthly revenue
      const monthSales = allSales.filter(s => {
        const d = new Date(s.date || s.createdAt);
        return d >= startOfMonth && d <= endOfMonth;
      });
      const monthBills = allBills.filter(b => {
        const d = new Date(b.billDate || b.createdAt);
        return d >= startOfMonth && d <= endOfMonth;
      });
      const monthInvoices = allInvoices.filter(inv => {
        const d = new Date(inv.invoiceDate || inv.createdAt);
        return d >= startOfMonth && d <= endOfMonth;
      });

      const monthSalesRevenue = monthSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      const monthBillsRevenue = monthBills.reduce((sum, b) => sum + (b.total || 0), 0);
      const monthInvoicesRevenue = monthInvoices.reduce((sum, inv) => sum + (inv.totalInvoiceValue || 0), 0);
      const totalRevenueThisMonth = Math.max(monthSalesRevenue, monthBillsRevenue + monthInvoicesRevenue) || monthSalesRevenue || monthBillsRevenue || 0;

      // 2. Active Labourers
      const activeLabourerCount = await Labourer.countDocuments({ companyId, active: true });

      // 3. Labour Payments this month
      const paymentsThisMonth = await LabourPayment.find({
        companyId,
        date: { $gte: startOfMonth, $lte: endOfMonth }
      });
      const totalLabourPaymentsThisMonth = paymentsThisMonth.reduce((sum, p) => sum + (p.amount || 0), 0);

      totalRevenueAllTimeAll += totalRevenueAllTime;
      totalRevenueThisMonthAll += totalRevenueThisMonth;
      totalActiveLabourersAll += activeLabourerCount;
      totalLabourPaymentsThisMonthAll += totalLabourPaymentsThisMonth;

      companyStats.push({
        companyId: company._id,
        name: company.name,
        slug: company.slug,
        billType: company.billType,
        tagline: company.tagline,
        addresses: company.addresses,
        invoicePrefix: company.invoicePrefix,
        totalRevenue: totalRevenueAllTime,
        monthlyRevenue: totalRevenueThisMonth,
        activeLabourers: activeLabourerCount,
        monthlyLabourCost: totalLabourPaymentsThisMonth
      });
    }

    res.status(200).json({
      companies: companyStats,
      totals: {
        totalRevenue: totalRevenueAllTimeAll,
        monthlyRevenue: totalRevenueThisMonthAll,
        totalLabourers: totalActiveLabourersAll,
        monthlyLabourCost: totalLabourPaymentsThisMonthAll
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
