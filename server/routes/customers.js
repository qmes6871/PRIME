const express = require('express');
const router = express.Router();
const { Customer, Consultation, CustomerCoverage, DesignConsent, MessageLog } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize');

// GET /api/v1/customers
router.get('/', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const where = { agent_id: req.agent.id };

    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Customer.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      customers: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit))
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/customers/:id
router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, agent_id: req.agent.id },
      include: [
        { model: Consultation, limit: 10, order: [['created_at', 'DESC']] },
        { model: CustomerCoverage }
      ]
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/customers
router.post('/', async (req, res, next) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      agent_id: req.agent.id
    });
    res.status(201).json({ customer });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/customers/:id
router.put('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    await customer.update(req.body);
    res.json({ customer });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/customers/design-consent/:consentId - 설계 동의 삭제
router.delete('/design-consent/:consentId', async (req, res, next) => {
  try {
    const consent = await DesignConsent.findOne({
      where: { id: req.params.consentId, agent_id: req.agent.id }
    });
    if (!consent) return res.status(404).json({ error: '설계 동의를 찾을 수 없습니다.' });

    await consent.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/customers/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    await customer.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/customers/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const customer = await Customer.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    await customer.update({ status });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/customers/:id/design-consent - 설계 동의 링크 생성
router.post('/:id/design-consent', async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    const { send_sms, phone } = req.body || {};

    const token = crypto.randomBytes(32).toString('hex');
    const consent = await DesignConsent.create({
      customer_id: customer.id,
      agent_id: req.agent.id,
      token
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const link = `${baseUrl}/design-consent.html?token=${token}`;

    let sms_sent = false;
    let sms_error = null;

    if (send_sms && phone) {
      try {
        const { sendSMS } = require('../utils/sms');
        const message = `[프라임에셋] 설계 동의서 작성을 요청드립니다.\n아래 링크를 눌러 작성해 주세요.\n${link}`;
        await sendSMS(phone, message);
        sms_sent = true;

        // 메시지 로그 기록
        await MessageLog.create({
          agent_id: req.agent.id,
          customer_id: customer.id,
          type: 'SMS',
          content: message,
          recipient_phone: phone,
          recipient_name: customer.name,
          status: '성공',
          sent_at: new Date()
        });
      } catch (smsErr) {
        sms_error = smsErr.message;
        await MessageLog.create({
          agent_id: req.agent.id,
          customer_id: customer.id,
          type: 'SMS',
          content: `설계 동의서 링크 발송`,
          recipient_phone: phone,
          recipient_name: customer.name,
          status: '실패',
          error_message: smsErr.message,
          sent_at: new Date()
        });
      }
    }

    res.status(201).json({ consent, link, sms_sent, sms_error });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/customers/:id/design-consent - 설계 동의 답변 조회
router.get('/:id/design-consent', async (req, res, next) => {
  try {
    const consents = await DesignConsent.findAll({
      where: { customer_id: req.params.id, agent_id: req.agent.id },
      order: [['created_at', 'DESC']]
    });

    const now = new Date();
    const result = consents.map(c => {
      const json = c.toJSON();
      if (json.status === '완료' && json.submitted_at) {
        const expires = new Date(json.submitted_at);
        expires.setMonth(expires.getMonth() + 1);
        json.expires_at = expires.toISOString();
        if (now > expires) {
          json.expired = true;
          json.address = null;
          json.occupation = null;
          json.military_service = null;
          json.resident_number_front = null;
          json.resident_number_back = null;
        }
      }
      return json;
    });

    res.json({ consents: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
