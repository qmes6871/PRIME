const express = require('express');
const router = express.Router();
const { Customer, Consultation, CustomerCoverage } = require('../models');
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

module.exports = router;
