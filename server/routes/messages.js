const express = require('express');
const router = express.Router();
const { MessageLog, Customer, MessageTemplate } = require('../models');

// POST /api/v1/messages/send
router.post('/send', async (req, res, next) => {
  try {
    const { customer_id, template_id, type, content, recipient_phone, recipient_name } = req.body;

    const log = await MessageLog.create({
      agent_id: req.agent.id,
      customer_id,
      template_id,
      type: type || '클립보드',
      content,
      recipient_phone,
      recipient_name,
      status: type === '클립보드' ? '성공' : '대기',
      sent_at: new Date()
    });

    // TODO: 카카오 알림톡/SMS API 연동 시 여기서 발송 처리

    res.status(201).json({ log });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/messages/logs
router.get('/logs', async (req, res, next) => {
  try {
    const { customer_id, type, page = 1, limit = 20 } = req.query;
    const where = { agent_id: req.agent.id };
    if (customer_id) where.customer_id = customer_id;
    if (type) where.type = type;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await MessageLog.findAndCountAll({
      where,
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({ logs: rows, total: count });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
