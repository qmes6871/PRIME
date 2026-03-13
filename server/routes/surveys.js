const express = require('express');
const router = express.Router();
const { SurveyResponse, Customer } = require('../models');

// GET /api/v1/surveys
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = { agent_id: req.agent.id };
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await SurveyResponse.findAndCountAll({
      where,
      include: [{ model: Customer, attributes: ['id', 'name', 'phone'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({ surveys: rows, total: count });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/surveys/:id
router.get('/:id', async (req, res, next) => {
  try {
    const survey = await SurveyResponse.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!survey) return res.status(404).json({ error: '설문을 찾을 수 없습니다.' });
    res.json({ survey });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/surveys/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, customer_id } = req.body;
    const survey = await SurveyResponse.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!survey) return res.status(404).json({ error: '설문을 찾을 수 없습니다.' });

    const updateData = { status };
    if (customer_id) updateData.customer_id = customer_id;

    await survey.update(updateData);
    res.json({ survey });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/surveys/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const survey = await SurveyResponse.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!survey) return res.status(404).json({ error: '설문을 찾을 수 없습니다.' });

    await survey.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
