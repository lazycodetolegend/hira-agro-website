const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');
const seedCompanies = require('./utils/seedCompanies');
const migrateCompanyId = require('./utils/migrateCompanyId');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/super-admin', require('./routes/superAdminRoutes'));
app.use('/api/labourers', require('./routes/labourerRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/labour-payments', require('./routes/labourPaymentRoutes'));
app.use('/api/labour', require('./routes/labourSummaryRoutes'));
app.use('/api/bills', require('./routes/billOfSupplyRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Connect DB & start server
connectDB().then(async () => {
  await seedCompanies();
  await seedAdmin();
  await migrateCompanyId();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
