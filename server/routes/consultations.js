const express = require('express');
const router = express.Router();
const { Consultation, ConsultationInsurer, Customer, InsuranceCompany } = require('../models');
const crypto = require('crypto');

// GET /api/v1/consultations
router.get('/', async (req, res, next) => {
  try {
    const { customer_id, status, page = 1, limit = 20 } = req.query;
    const where = { agent_id: req.agent.id };
    if (customer_id) where.customer_id = customer_id;
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Consultation.findAndCountAll({
      where,
      include: [
        { model: Customer, attributes: ['id', 'name', 'phone'] },
        { model: ConsultationInsurer, as: 'insurers', include: [InsuranceCompany] }
      ],
      order: [['updated_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({ consultations: rows, total: count });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/consultations/:id
router.get('/:id', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { id: req.params.id, agent_id: req.agent.id },
      include: [
        { model: Customer },
        { model: ConsultationInsurer, as: 'insurers', include: [InsuranceCompany] }
      ]
    });
    if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });
    res.json({ consultation });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/consultations
router.post('/', async (req, res, next) => {
  try {
    const { insurers, ...data } = req.body;
    const consultation = await Consultation.create({
      ...data,
      agent_id: req.agent.id
    });

    if (insurers && insurers.length > 0) {
      await ConsultationInsurer.bulkCreate(
        insurers.map(i => ({ ...i, consultation_id: consultation.id }))
      );
    }

    // Update customer status
    if (data.customer_id) {
      await Customer.update(
        { status: '상담중' },
        { where: { id: data.customer_id, agent_id: req.agent.id } }
      );
    }

    const full = await Consultation.findByPk(consultation.id, {
      include: [
        { model: Customer },
        { model: ConsultationInsurer, as: 'insurers', include: [InsuranceCompany] }
      ]
    });

    res.status(201).json({ consultation: full });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/consultations/:id
router.put('/:id', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });

    const { insurers, ...data } = req.body;
    await consultation.update(data);

    if (insurers !== undefined) {
      await ConsultationInsurer.destroy({ where: { consultation_id: consultation.id } });
      if (insurers.length > 0) {
        await ConsultationInsurer.bulkCreate(
          insurers.map(i => ({ ...i, consultation_id: consultation.id }))
        );
      }
    }

    const full = await Consultation.findByPk(consultation.id, {
      include: [
        { model: Customer },
        { model: ConsultationInsurer, as: 'insurers', include: [InsuranceCompany] }
      ]
    });

    res.json({ consultation: full });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/consultations/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });

    await ConsultationInsurer.destroy({ where: { consultation_id: consultation.id } });
    await consultation.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/consultations/:id/share
router.post('/:id/share', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });

    const shareToken = crypto.randomBytes(12).toString('hex');
    const shareExpiresAt = new Date();
    shareExpiresAt.setDate(shareExpiresAt.getDate() + 30);

    await consultation.update({
      share_token: shareToken,
      share_expires_at: shareExpiresAt,
      shared_at: new Date(),
      status: '발송완료'
    });

    res.json({
      share_token: shareToken,
      share_url: `/prime/proposal.html?token=${shareToken}`,
      expires_at: shareExpiresAt
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
