const express = require('express');
const router = express.Router();
const { MessageTemplate } = require('../models');

// Default template contents for reset
const DEFAULT_TEMPLATES = {
  '담당자변경': {
    title: '담당자 변경 안내',
    content: `안녕하세요, {{고객명}}님.\n\n기존 담당 설계사의 변경으로 인해, 앞으로 {{고객명}}님의 보험 관련 업무는 제가 담당하게 되었습니다.\n\n저는 프라임에셋 {{설계사명}}입니다.\n\n{{고객명}}님의 소중한 보장이 잘 유지될 수 있도록 최선을 다하겠습니다.\n\n궁금한 점이 있으시면 언제든 연락 주세요.\n📞 {{설계사연락처}}\n\n감사합니다.`,
    variables: ['고객명', '설계사명', '설계사연락처']
  },
  '해지': {
    title: '해지 안내',
    content: `안녕하세요, {{고객명}}님.\n\n{{보험사명}} {{상품명}} 해지 관련 안내드립니다.\n\n해지 시 환급금: {{환급금}}\n해지 신청 방법:\n1. 고객센터 전화: {{보험사전화}}\n2. 모바일 앱에서 직접 신청\n\n해지 전 꼭 확인해주세요:\n- 보장 공백이 생기지 않는지\n- 재가입 시 보험료 인상 여부\n\n궁금한 점은 언제든 연락 주세요.\n📞 {{설계사연락처}}`,
    variables: ['고객명', '보험사명', '상품명', '환급금', '보험사전화', '설계사연락처']
  },
  '실효해지': {
    title: '실효 해지 안내',
    content: `안녕하세요, {{고객명}}님.\n\n{{보험사명}} {{상품명}}이 보험료 미납으로 인해 실효 상태입니다.\n\n실효일: {{실효일}}\n부활 가능 기간: 실효일로부터 3년 이내\n\n부활 신청 시 필요사항:\n- 밀린 보험료 납부\n- 건강 고지 (경우에 따라 건강검진)\n\n조속한 부활을 권해드립니다.\n📞 {{설계사연락처}}`,
    variables: ['고객명', '보험사명', '상품명', '실효일', '설계사연락처']
  },
  '청구서류': {
    title: '보험금 청구 서류 안내',
    content: `안녕하세요, {{고객명}}님.\n\n보험금 청구에 필요한 서류를 안내드립니다.\n\n【{{보험사명}} 보험금 청구 서류】\n\n기본 서류:\n{{서류목록}}\n\n청구 방법:\n1. {{보험사명}} 고객센터: {{보험사전화}}\n2. {{보험사명}} 모바일 앱\n3. 팩스 접수: {{팩스번호}}\n\n서류 준비에 어려움이 있으시면 연락 주세요.\n📞 {{설계사연락처}}`,
    variables: ['고객명', '보험사명', '서류목록', '보험사전화', '팩스번호', '설계사연락처']
  },
  '자동이체해지': {
    title: '자동이체 해지 안내',
    content: `안녕하세요, {{고객명}}님.\n\n{{보험사명}} {{상품명}}의 자동이체 변경/해지 안내입니다.\n\n현재 이체 계좌: {{현재계좌}}\n변경 방법:\n1. {{보험사명}} 고객센터: {{보험사전화}}\n2. {{보험사명}} 모바일 앱 > 계약관리 > 납입정보변경\n\n※ 자동이체 해지 시 보험료 미납으로 실효될 수 있으니 주의해주세요.\n\n궁금한 점은 연락 주세요.\n📞 {{설계사연락처}}`,
    variables: ['고객명', '보험사명', '상품명', '현재계좌', '보험사전화', '설계사연락처']
  }
};

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

// POST /api/v1/templates/:id/reset - Reset template to default
router.post('/:id/reset', async (req, res, next) => {
  try {
    const template = await MessageTemplate.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!template) return res.status(404).json({ error: '템플릿을 찾을 수 없습니다.' });

    const defaults = DEFAULT_TEMPLATES[template.type];
    if (!defaults) return res.status(400).json({ error: '기본값이 없는 템플릿입니다.' });

    await template.update({
      title: defaults.title,
      content: defaults.content,
      variables: defaults.variables
    });
    res.json({ template, message: '기본값으로 복원되었습니다.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
