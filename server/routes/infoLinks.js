const express = require('express');
const router = express.Router();
const { InfoLink } = require('../models');

// GET /api/v1/info-links
router.get('/', async (req, res, next) => {
  try {
    const links = await InfoLink.findAll({
      where: { agent_id: req.agent.id, is_active: true },
      order: [['sort_order', 'ASC']]
    });
    res.json({ links });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/info-links
router.post('/', async (req, res, next) => {
  try {
    const link = await InfoLink.create({
      ...req.body,
      agent_id: req.agent.id
    });
    res.status(201).json({ link });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/info-links/:id
router.put('/:id', async (req, res, next) => {
  try {
    const link = await InfoLink.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!link) return res.status(404).json({ error: '링크를 찾을 수 없습니다.' });

    await link.update(req.body);
    res.json({ link });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/info-links/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const link = await InfoLink.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!link) return res.status(404).json({ error: '링크를 찾을 수 없습니다.' });

    await link.update({ is_active: false });
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
