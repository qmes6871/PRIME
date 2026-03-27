const express = require('express');
const router = express.Router();
const { Consultation, ConsultationInsurer, Customer, InsuranceCompany, ConsultationHistory } = require('../models');
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
      share_url: `/proposal.html?token=${shareToken}`,
      expires_at: shareExpiresAt
    });
  } catch (err) {
    next(err);
  }
});

// ==================== History Endpoints ====================

// GET /api/v1/consultations/:id/history
router.get('/:id/history', async (req, res, next) => {
  try {
    const histories = await ConsultationHistory.findAll({
      where: { consultation_id: req.params.id, agent_id: req.agent.id },
      attributes: ['id', 'save_type', 'label', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 20
    });
    res.json({ histories });
  } catch (err) { next(err); }
});

// GET /api/v1/consultations/:id/history/:historyId
router.get('/:id/history/:historyId', async (req, res, next) => {
  try {
    const history = await ConsultationHistory.findOne({
      where: { id: req.params.historyId, consultation_id: req.params.id, agent_id: req.agent.id }
    });
    if (!history) return res.status(404).json({ error: '이력을 찾을 수 없습니다.' });
    res.json({ history });
  } catch (err) { next(err); }
});

// POST /api/v1/consultations/:id/history - 수동 스냅샷
router.post('/:id/history', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });

    const history = await ConsultationHistory.create({
      consultation_id: consultation.id,
      agent_id: req.agent.id,
      proposal_html: consultation.proposal_html,
      progress_memo: consultation.progress_memo || '',
      save_type: req.body.save_type || 'manual',
      label: req.body.label || null
    });

    // 최대 20개 유지
    const count = await ConsultationHistory.count({ where: { consultation_id: consultation.id } });
    if (count > 20) {
      const oldest = await ConsultationHistory.findAll({
        where: { consultation_id: consultation.id },
        order: [['created_at', 'ASC']],
        limit: count - 20
      });
      await ConsultationHistory.destroy({ where: { id: oldest.map(h => h.id) } });
    }

    res.status(201).json({ history: { id: history.id, save_type: history.save_type, label: history.label, created_at: history.created_at } });
  } catch (err) { next(err); }
});

// POST /api/v1/consultations/:id/history/:historyId/restore
router.post('/:id/history/:historyId/restore', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!consultation) return res.status(404).json({ error: '상담을 찾을 수 없습니다.' });

    const history = await ConsultationHistory.findOne({
      where: { id: req.params.historyId, consultation_id: consultation.id, agent_id: req.agent.id }
    });
    if (!history) return res.status(404).json({ error: '이력을 찾을 수 없습니다.' });

    // 복원 전 현재 상태 백업
    await ConsultationHistory.create({
      consultation_id: consultation.id,
      agent_id: req.agent.id,
      proposal_html: consultation.proposal_html,
      progress_memo: consultation.progress_memo || '',
      save_type: 'manual',
      label: '복원 전 자동백업'
    });

    // 복원
    await consultation.update({
      proposal_html: history.proposal_html,
      progress_memo: history.progress_memo
    });

    res.json({ message: '복원되었습니다.' });
  } catch (err) { next(err); }
});

module.exports = router;
