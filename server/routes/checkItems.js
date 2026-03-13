const express = require('express');
const router = express.Router();
const { CoverageCheckItem } = require('../models');

// GET /api/v1/check-items
router.get('/', async (req, res, next) => {
  try {
    const items = await CoverageCheckItem.findAll({
      where: { agent_id: req.agent.id, is_active: true },
      order: [['category', 'ASC'], ['sort_order', 'ASC']]
    });
    res.json({ items });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/check-items
router.post('/', async (req, res, next) => {
  try {
    const item = await CoverageCheckItem.create({
      ...req.body,
      agent_id: req.agent.id
    });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/check-items/:id
router.put('/:id', async (req, res, next) => {
  try {
    const item = await CoverageCheckItem.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!item) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });

    await item.update(req.body);
    res.json({ item });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/check-items/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const item = await CoverageCheckItem.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!item) return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });

    await item.update({ is_active: false });
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
