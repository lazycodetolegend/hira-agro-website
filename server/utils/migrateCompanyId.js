const Company = require('../models/Company');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const StockLog = require('../models/StockLog');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const User = require('../models/User');

const migrateCompanyId = async () => {
  try {
    // Find Hira Agro company
    const hiraAgro = await Company.findOne({ slug: 'hira-agro' });
    if (!hiraAgro) {
      console.log('⏳ Migration skipped — Hira Agro company not found yet (run seedCompanies first)');
      return;
    }

    const hiraAgroId = hiraAgro._id;
    let migrated = false;

    // Migrate Products
    const productResult = await Product.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: hiraAgroId } }
    );
    if (productResult.modifiedCount > 0) {
      console.log(`  📦 Migrated ${productResult.modifiedCount} products → Hira Agro`);
      migrated = true;
    }

    // Migrate Sales
    const saleResult = await Sale.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: hiraAgroId } }
    );
    if (saleResult.modifiedCount > 0) {
      console.log(`  🛒 Migrated ${saleResult.modifiedCount} sales → Hira Agro`);
      migrated = true;
    }

    // Migrate StockLogs
    const stockResult = await StockLog.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: hiraAgroId } }
    );
    if (stockResult.modifiedCount > 0) {
      console.log(`  📋 Migrated ${stockResult.modifiedCount} stock logs → Hira Agro`);
      migrated = true;
    }

    // Migrate Invoices
    const invoiceResult = await Invoice.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: hiraAgroId } }
    );
    if (invoiceResult.modifiedCount > 0) {
      console.log(`  🧾 Migrated ${invoiceResult.modifiedCount} invoices → Hira Agro`);
      migrated = true;
    }

    // Migrate Expenses
    const expenseResult = await Expense.updateMany(
      { companyId: { $exists: false } },
      { $set: { companyId: hiraAgroId } }
    );
    if (expenseResult.modifiedCount > 0) {
      console.log(`  💰 Migrated ${expenseResult.modifiedCount} expenses → Hira Agro`);
      migrated = true;
    }

    // Migrate Users (admin/manager only, not super_admin)
    const userResult = await User.updateMany(
      { companyId: { $exists: false }, role: { $in: ['admin', 'manager'] } },
      { $set: { companyId: hiraAgroId } }
    );
    if (userResult.modifiedCount > 0) {
      console.log(`  👤 Migrated ${userResult.modifiedCount} users → Hira Agro`);
      migrated = true;
    }

    if (migrated) {
      console.log('✅ Data migration to Hira Agro company completed');
    }
  } catch (error) {
    console.error('Error during companyId migration:', error.message);
  }
};

module.exports = migrateCompanyId;
