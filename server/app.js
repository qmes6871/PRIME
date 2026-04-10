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

// 제안서 페이지 - 카카오톡 공유 시 고객명 포함 title/OG 태그 동적 생성
const { Consultation, Customer, Agent } = require('./models');
const fs = require('fs');
app.get('/proposal.html', async (req, res, next) => {
  const token = req.query.token;
  if (!token) return next();
  try {
    const consultation = await Consultation.findOne({
      where: { share_token: token },
      include: [
        { model: Customer, attributes: ['name'] },
        { model: Agent, attributes: ['name', 'position', 'branch', 'share_image'] }
      ]
    });
    const customerName = consultation?.Customer?.name || '';
    const agent = consultation?.Agent || {};
    const title = customerName ? `${customerName} 고객님을 위한 맞춤 컨설팅 리포트` : '맞춤 컨설팅 리포트';
    const description = agent.name ? `${agent.name} ${agent.position || ''} | ${agent.branch || '프라임에셋'}` : '보험 전문가가 준비한 맞춤 컨설팅 리포트입니다.';
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ogImage = agent.share_image ? `${baseUrl}${agent.share_image}` : `${baseUrl}/images/og-proposal.png`;

    let html = fs.readFileSync(path.join(__dirname, '..', 'public', 'proposal.html'), 'utf-8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    const ogTags = `<meta property="og:title" content="${title}">\n  <meta property="og:description" content="${description}">\n  <meta property="og:image" content="${ogImage}">\n  <meta property="og:type" content="website">\n  <meta property="og:url" content="${baseUrl}/proposal.html?token=${token}">`;
    html = html.replace('</head>', `  ${ogTags}\n</head>`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(html);
  } catch (err) {
    next();
  }
});

// 블로그 글 공개 페이지 - OG 태그 동적 생성
const { InfoLink } = require('./models');
app.get('/blog.html', async (req, res, next) => {
  const id = req.query.id;
  if (!id) return next();
  try {
    const article = await InfoLink.findOne({
      where: { id, type: 'article', is_active: true },
      include: [{ model: Agent, attributes: ['name', 'position', 'branch', 'profile_image'] }]
    });
    if (!article) return next();

    const title = article.title || '블로그';
    const desc = article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 120) : '';
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const ogImage = article.image_url ? `${baseUrl}${article.image_url}` : '';

    let html = fs.readFileSync(path.join(__dirname, '..', 'public', 'blog.html'), 'utf-8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${title} | 프라임에셋</title>`);
    const ogTags = `<meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/blog.html?id=${id}">`;
    html = html.replace('</head>', `  ${ogTags}\n</head>`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(html);
  } catch (err) {
    next();
  }
});

// Static files (no cache for JS/CSS during development)
app.use('/', express.static(path.join(__dirname, '..', 'public'), {
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
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/public', require('./routes/public'));

// API Routes - Protected
app.use('/api/v1/dashboard', authMiddleware, require('./routes/dashboard'));
app.use('/api/v1/customers', authMiddleware, require('./routes/customers'));
app.use('/api/v1/consultations', authMiddleware, require('./routes/consultations'));
app.use('/api/v1/templates', authMiddleware, require('./routes/templates'));
app.use('/api/v1/messages', authMiddleware, require('./routes/messages'));
app.use('/api/v1/customers', authMiddleware, require('./routes/coverages'));
app.use('/api/v1/check-items', authMiddleware, require('./routes/checkItems'));
app.use('/api/v1/info-links', authMiddleware, require('./routes/infoLinks'));
app.use('/api/v1/insurance-companies', authMiddleware, require('./routes/insuranceCompanies'));
app.use('/api/v1/surveys', authMiddleware, require('./routes/surveys'));
app.use('/api/v1/settings', authMiddleware, require('./routes/settings'));
app.use('/api/v1/uploads', authMiddleware, require('./routes/uploads'));
app.use('/api/v1/admin', authMiddleware, require('./routes/admin'));
app.use('/api/v1/calendar', authMiddleware, require('./routes/calendar'));

// SPA fallback - serve index.html for client-side routes
app.get('/*', (req, res) => {
  // Don't intercept API calls or static file requests with extensions
  if (req.path.startsWith('/api/') || path.extname(req.path)) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Error handler
app.use(errorHandler);

module.exports = app;
