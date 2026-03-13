const express = require('express');
const router = express.Router();
const { CustomerCoverage, Customer } = require('../models');

// GET /api/v1/customers/:customerId/coverages
router.get('/:customerId/coverages', async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.customerId, agent_id: req.agent.id }
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    const coverages = await CustomerCoverage.findAll({
      where: { customer_id: req.params.customerId, agent_id: req.agent.id },
      order: [['category', 'ASC'], ['created_at', 'ASC']]
    });
    res.json({ coverages, customer });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/customers/:customerId/coverages
router.post('/:customerId/coverages', async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      where: { id: req.params.customerId, agent_id: req.agent.id }
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    const coverage = await CustomerCoverage.create({
      ...req.body,
      customer_id: req.params.customerId,
      agent_id: req.agent.id
    });
    res.status(201).json({ coverage });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/customers/:customerId/coverages/:id
router.put('/:customerId/coverages/:id', async (req, res, next) => {
  try {
    const coverage = await CustomerCoverage.findOne({
      where: { id: req.params.id, customer_id: req.params.customerId, agent_id: req.agent.id }
    });
    if (!coverage) return res.status(404).json({ error: '보장 정보를 찾을 수 없습니다.' });

    await coverage.update(req.body);
    res.json({ coverage });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/customers/:customerId/coverages/:id
router.delete('/:customerId/coverages/:id', async (req, res, next) => {
  try {
    const coverage = await CustomerCoverage.findOne({
      where: { id: req.params.id, customer_id: req.params.customerId, agent_id: req.agent.id }
    });
    if (!coverage) return res.status(404).json({ error: '보장 정보를 찾을 수 없습니다.' });

    await coverage.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/customers/:customerId/coverages/bulk
router.post('/:customerId/coverages/bulk', async (req, res, next) => {
  try {
    const { coverages } = req.body;
    const created = await CustomerCoverage.bulkCreate(
      coverages.map(c => ({
        ...c,
        customer_id: req.params.customerId,
        agent_id: req.agent.id
      }))
    );
    res.status(201).json({ coverages: created });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
