const express = require('express');
const router = express.Router();
const { AgentSetting, Agent } = require('../models');
const bcrypt = require('bcrypt');

// GET /api/v1/settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await AgentSetting.findOne({
      where: { agent_id: req.agent.id }
    });
    if (!settings) {
      settings = await AgentSetting.create({ agent_id: req.agent.id });
    }

    const agent = await Agent.findByPk(req.agent.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ settings, agent });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/settings
router.put('/', async (req, res, next) => {
  try {
    let settings = await AgentSetting.findOne({
      where: { agent_id: req.agent.id }
    });
    if (!settings) {
      settings = await AgentSetting.create({ agent_id: req.agent.id });
    }

    await settings.update(req.body);
    res.json({ settings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/settings/profile
router.put('/profile', async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.agent.id);
    const { name, phone, email, position, branch } = req.body;
    await agent.update({ name, phone, email, position, branch });
    res.json({ agent: { id: agent.id, name, phone, email, position, branch } });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/settings/password
router.put('/password', async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const agent = await Agent.findByPk(req.agent.id);

    const isValid = await bcrypt.compare(current_password, agent.password);
    if (!isValid) {
      return res.status(400).json({ error: '현재 비밀번호가 올바르지 않습니다.' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await agent.update({ password: hashedPassword });
    res.json({ message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
