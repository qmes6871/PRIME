const express = require('express');
const router = express.Router();
const { AgentSetting, Agent } = require('../models');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 확인/생성
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    const { name, phone, email, position, branch, profile_image, profile_intro } = req.body;
    await agent.update({ name, phone, email, position, branch, profile_image, profile_intro });
    res.json({ agent: { id: agent.id, name, phone, email, position, branch, profile_image, profile_intro, share_image: agent.share_image } });
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

// POST /api/v1/settings/profile-image - Base64 이미지 업로드
router.post('/profile-image', async (req, res, next) => {
  try {
    const { image } = req.body; // base64 string
    if (!image) {
      return res.status(400).json({ error: '이미지가 필요합니다.' });
    }

    const matches = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: '올바른 이미지 형식이 아닙니다.' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `agent_${req.agent.id}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/profiles/${filename}`;
    const agent = await Agent.findByPk(req.agent.id);

    // 이전 프로필 이미지 삭제
    if (agent.profile_image) {
      const oldPath = path.join(__dirname, '..', '..', 'public', agent.profile_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await agent.update({ profile_image: imageUrl });
    res.json({ profile_image: imageUrl });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/settings/share-image - 공유 링크 대표 이미지 업로드
router.post('/share-image', async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: '이미지가 필요합니다.' });
    }

    const matches = image.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ error: '올바른 이미지 형식이 아닙니다.' });
    }

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `share_${req.agent.id}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/profiles/${filename}`;
    const agent = await Agent.findByPk(req.agent.id);

    // 이전 공유 이미지 삭제
    if (agent.share_image) {
      const oldPath = path.join(__dirname, '..', '..', 'public', agent.share_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await agent.update({ share_image: imageUrl });
    res.json({ share_image: imageUrl });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/settings/share-image - 공유 링크 대표 이미지 삭제
router.delete('/share-image', async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.agent.id);
    if (agent.share_image) {
      const oldPath = path.join(__dirname, '..', '..', 'public', agent.share_image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      await agent.update({ share_image: null });
    }
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
