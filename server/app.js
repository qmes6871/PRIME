const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (no cache for JS/CSS during development)
app.use('/prime', express.static(path.join(__dirname, '..', 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// API Routes - Public (no auth)
app.use('/prime/api/v1/auth', require('./routes/auth'));
app.use('/prime/api/v1/public', require('./routes/public'));

// API Routes - Protected
app.use('/prime/api/v1/dashboard', authMiddleware, require('./routes/dashboard'));
app.use('/prime/api/v1/customers', authMiddleware, require('./routes/customers'));
app.use('/prime/api/v1/consultations', authMiddleware, require('./routes/consultations'));
app.use('/prime/api/v1/templates', authMiddleware, require('./routes/templates'));
app.use('/prime/api/v1/messages', authMiddleware, require('./routes/messages'));
app.use('/prime/api/v1/customers', authMiddleware, require('./routes/coverages'));
app.use('/prime/api/v1/check-items', authMiddleware, require('./routes/checkItems'));
app.use('/prime/api/v1/info-links', authMiddleware, require('./routes/infoLinks'));
app.use('/prime/api/v1/insurance-companies', authMiddleware, require('./routes/insuranceCompanies'));
app.use('/prime/api/v1/surveys', authMiddleware, require('./routes/surveys'));
app.use('/prime/api/v1/settings', authMiddleware, require('./routes/settings'));
app.use('/prime/api/v1/uploads', authMiddleware, require('./routes/uploads'));

// SPA fallback - serve index.html for client-side routes
app.get('/prime/*', (req, res) => {
  // Don't intercept API calls or static file requests with extensions
  if (req.path.startsWith('/prime/api/') || path.extname(req.path)) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handler
app.use(errorHandler);

module.exports = app;
