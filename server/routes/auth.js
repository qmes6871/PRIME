const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Agent, AgentSetting } = require('../models');

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { login_id, password } = req.body;
    if (!login_id || !password) {
      return res.status(400).json({ error: '아이디와 비밀번호를 입력하세요.' });
    }

    const agent = await Agent.findOne({ where: { login_id, is_active: true } });
    if (!agent) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isValid = await bcrypt.compare(password, agent.password);
    if (!isValid) {
      return res.status(401).json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign(
      { id: agent.id, login_id: agent.login_id, name: agent.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      agent: {
        id: agent.id,
        login_id: agent.login_id,
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        position: agent.position,
        branch: agent.branch
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { login_id, password, name, phone, email, position, branch } = req.body;
    if (!login_id || !password || !name) {
      return res.status(400).json({ error: '필수 항목을 입력하세요.' });
    }

    const existing = await Agent.findOne({ where: { login_id } });
    if (existing) {
      return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = await Agent.create({
      login_id, password: hashedPassword, name, phone, email, position, branch
    });

    // Create default settings
    await AgentSetting.create({ agent_id: agent.id });

    const token = jwt.sign(
      { id: agent.id, login_id: agent.login_id, name: agent.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      agent: {
        id: agent.id,
        login_id: agent.login_id,
        name: agent.name
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/auth/me
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.agent.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({ agent });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
