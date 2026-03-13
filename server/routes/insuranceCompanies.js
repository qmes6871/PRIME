const express = require('express');
const router = express.Router();
const { InsuranceCompany } = require('../models');

// GET /api/v1/insurance-companies
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;
    const where = { is_active: true };
    if (type) where.type = type;

    const companies = await InsuranceCompany.findAll({
      where,
      order: [['type', 'ASC'], ['sort_order', 'ASC'], ['name', 'ASC']]
    });
    res.json({ companies });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
