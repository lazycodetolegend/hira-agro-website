const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Refuse to run without a real signing key. This repository is public, so a
// default secret would let anyone mint a valid admin token.
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Refusing to start.');
  process.exit(1);
}

const connectDB = require('./config/db');
const seedAdmin = require('./utils/seedAdmin');
const seedCompanies = require('./utils/seedCompanies');
const migrateCompanyId = require('./utils/migrateCompanyId');

const app = express();

// Render terminates TLS in front of the app; trust its proxy headers so rate
// limiting sees the real client IP.
app.set('trust proxy', 1);

// Security headers. crossOriginResourcePolicy must stay permissive or the
// Vercel frontend cannot load product images served from /uploads.
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Only the known frontend origins may call this API from a browser.
const ALLOWED_ORIGINS = [
  'https://hira-agro-website.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173'
];
const ALLOWED_ORIGIN_PATTERN = /^https:\/\/hira-agro-website-[a-z0-9-]+\.vercel\.app$/;
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);                              // curl / server-to-server
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    if (ALLOWED_ORIGIN_PATTERN.test(origin)) return callback(null, true);  // project preview deploys
    return callback(null, false);                                          // browser blocks the response
  },
  credentials: true
}));

// Throttle the credential endpoints so passwords cannot be brute forced.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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
