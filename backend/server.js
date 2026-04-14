const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const { Product } = require('./models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// === PROFESSIONAL MIDDLEWARE STACK ===
// 1. Security
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://modernsweets.in' : 'http://localhost:3000',
  credentials: true
}));

// 2. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 3. Logging
app.use(morgan('combined'));

// 4. Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Production static serve
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));
}

// === MODELS ===
const { Product } = require('./models');

// === ROUTES ===
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/orders', require('./routes/orders'));
app.use('/api/admin/products', require('./routes/products'));

// Public APIs
app.post('/api/orders', async (req, res) => {
  try {
    res.json({ success: true, message: 'Customer order received' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    let products = await Product.find();
    if (products.length === 0) {
      const { bakeryProducts } = require('./data/full-products.js');
      products = await Product.insertMany(bakeryProducts.map(p => ({
        name: p.NameToDisplay,
        qty: p['Curr.Qty'],
        groupName: p.GroupName,
        category: p.Category,
        hsncode: p.HSNCODE,
        unit1: p.Unit1,
        prodConv1: p.ProdConv1,
        unit2: p.Unit2,
        salesTax: p.SalesTax,
        purchaseTax: p.PurchaseTax
      })));
    }
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.get('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use(require('./middleware/errorHandler'));

// Mongo connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Graceful shutdown
process.on('SIGTERM', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Professional Express API running on http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
});
