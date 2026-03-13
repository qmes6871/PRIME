const express = require('express');
const router = express.Router();
const { MessageTemplate } = require('../models');

// GET /api/v1/templates
router.get('/', async (req, res, next) => {
  try {
    const { category, type } = req.query;
    const where = { agent_id: req.agent.id, is_active: true };
    if (category) where.category = category;
    if (type) where.type = type;

    const templates = await MessageTemplate.findAll({
      where,
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']]
    });
    res.json({ templates });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/templates/:id
router.get('/:id', async (req, res, next) => {
  try {
    const template = await MessageTemplate.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!template) return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });
    res.json({ template });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/templates
router.post('/', async (req, res, next) => {
  try {
    const template = await MessageTemplate.create({
      ...req.body,
      agent_id: req.agent.id
    });
    res.status(201).json({ template });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/templates/:id
router.put('/:id', async (req, res, next) => {
  try {
    const template = await MessageTemplate.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!template) return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });

    await template.update(req.body);
    res.json({ template });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/templates/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const template = await MessageTemplate.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!template) return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });

    await template.update({ is_active: false });
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
