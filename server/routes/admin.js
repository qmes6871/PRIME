const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Agent, AgentSetting, MessageTemplate } = require('../models');

// Admin middleware
function adminOnly(req, res, next) {
  if (!req.agent.is_admin) {
    return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
  }
  next();
}
router.use(adminOnly);

// GET /api/v1/admin/agents - 전체 설계사 목록
router.get('/agents', async (req, res, next) => {
  try {
    const agents = await Agent.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']]
    });
    res.json({ agents });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/admin/agents - 설계사 계정 생성
router.post('/agents', async (req, res, next) => {
  try {
    const { login_id, password, name, phone, email, position, branch } = req.body;
    if (!login_id || !password || !name) {
      return res.status(400).json({ error: '아이디, 비밀번호, 이름은 필수입니다.' });
    }

    const existing = await Agent.findOne({ where: { login_id } });
    if (existing) {
      return res.status(409).json({ error: '이미 사용 중인 아이디입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = await Agent.create({
      login_id, password: hashedPassword, name,
      phone: phone || null, email: email || null,
      position: position || '설계사', branch: branch || null
    });

    // 기본 설정 생성
    await AgentSetting.create({ agent_id: agent.id });

    // 관리자 템플릿 복사
    const adminAgent = await Agent.findOne({ where: { is_admin: true } });
    if (adminAgent) {
      const adminTemplates = await MessageTemplate.findAll({
        where: { agent_id: adminAgent.id, is_active: true, is_default: true },
        raw: true
      });
      for (const t of adminTemplates) {
        await MessageTemplate.create({
          agent_id: agent.id,
          category: t.category,
          type: t.type,
          title: t.title,
          content: t.content,
          variables: t.variables,
          sort_order: t.sort_order,
          is_default: t.is_default
        });
      }
    }

    res.status(201).json({
      agent: {
        id: agent.id, login_id: agent.login_id, name: agent.name,
        phone: agent.phone, position: agent.position, branch: agent.branch,
        is_active: agent.is_active, is_admin: agent.is_admin
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/admin/agents/:id - 설계사 정보 수정
router.put('/agents/:id', async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) return res.status(404).json({ error: '설계사를 찾을 수 없습니다.' });

    const { name, phone, email, position, branch, is_active, is_admin, password } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (position !== undefined) updateData.position = position;
    if (branch !== undefined) updateData.branch = branch;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_admin !== undefined) updateData.is_admin = is_admin;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await agent.update(updateData);

    res.json({
      agent: {
        id: agent.id, login_id: agent.login_id, name: agent.name,
        phone: agent.phone, email: agent.email, position: agent.position,
        branch: agent.branch, is_active: agent.is_active, is_admin: agent.is_admin
      }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/admin/agents/:id - 설계사 삭제
router.delete('/agents/:id', async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.agent.id) {
      return res.status(400).json({ error: '자기 자신은 삭제할 수 없습니다.' });
    }
    const agent = await Agent.findByPk(req.params.id);
    if (!agent) return res.status(404).json({ error: '설계사를 찾을 수 없습니다.' });

    await agent.update({ is_active: false });
    res.json({ message: '비활성화되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
