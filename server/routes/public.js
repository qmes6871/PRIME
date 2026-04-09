const express = require('express');
const router = express.Router();
const { Consultation, ConsultationInsurer, InsuranceCompany, Customer, Agent, SurveyResponse, AgentSetting, CustomerCoverage, CoverageCheckItem, DesignConsent } = require('../models');

// GET /api/v1/public/proposal/:token - 고객용 제안서 (인증 불필요)
router.get('/proposal/:token', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { share_token: req.params.token },
      include: [
        { model: Customer, attributes: ['id', 'name'] },
        { model: Agent, attributes: ['id', 'name', 'phone', 'email', 'position', 'branch', 'profile_image', 'profile_intro', 'share_image'] },
        { model: ConsultationInsurer, as: 'insurers', include: [InsuranceCompany] }
      ]
    });

    if (!consultation) {
      return res.status(404).json({ error: '제안서를 찾을 수 없습니다.' });
    }

    // Mark as viewed
    if (!consultation.viewed_at) {
      await consultation.update({ viewed_at: new Date(), status: '확인완료' });
    }

    // 설정 정보도 함께 전달 (온라인예약, 카카오톡 URL 등)
    const settings = await AgentSetting.findOne({
      where: { agent_id: consultation.agent_id },
      attributes: ['fax_number', 'online_reservation_url', 'kakao_talk_url', 'coverage_labels', 'custom_coverage_categories']
    });

    // 공유용 스냅샷이 있으면 그것을 사용
    const result = consultation.toJSON();
    if (result.published_proposal) {
      result.proposal_html = result.published_proposal;
    }
    if (result.published_memo !== null && result.published_memo !== undefined) {
      result.progress_memo = result.published_memo;
    }

    res.json({ consultation: result, settings });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/public/survey/:agentToken - 설문 제출 (인증 불필요)
router.post('/survey/:agentId', async (req, res, next) => {
  try {
    const { respondent_name, respondent_phone, respondent_email, birth_date, gender, answers } = req.body;

    const survey = await SurveyResponse.create({
      agent_id: req.params.agentId,
      respondent_name,
      respondent_phone,
      respondent_email,
      birth_date,
      gender,
      answers,
      status: '신규'
    });

    res.status(201).json({ message: '설문이 제출되었습니다.', id: survey.id });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/public/survey-info/:agentId - 설문 페이지 정보
router.get('/survey-info/:agentId', async (req, res, next) => {
  try {
    const agent = await Agent.findByPk(req.params.agentId, {
      attributes: ['id', 'name', 'position', 'branch']
    });
    if (!agent) return res.status(404).json({ error: '설계사를 찾을 수 없습니다.' });

    const settings = await AgentSetting.findOne({
      where: { agent_id: req.params.agentId },
      attributes: ['company_name', 'survey_intro']
    });

    res.json({ agent, settings });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/public/coverage/:token - 고객 보장현황 공유
router.get('/coverage/:customerId/:token', async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.customerId, {
      attributes: ['id', 'name']
    });
    if (!customer) return res.status(404).json({ error: '고객을 찾을 수 없습니다.' });

    const coverages = await CustomerCoverage.findAll({
      where: { customer_id: req.params.customerId },
      order: [['category', 'ASC']]
    });

    res.json({ customer, coverages });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/public/design-consent/:token - 설계 동의 폼 데이터 조회
router.get('/design-consent/:token', async (req, res, next) => {
  try {
    const consent = await DesignConsent.findOne({
      where: { token: req.params.token },
      include: [{ model: Customer, attributes: ['name', 'phone'] }]
    });
    if (!consent) return res.status(404).json({ error: '유효하지 않은 링크입니다.' });
    if (consent.status === '완료') return res.status(400).json({ error: '이미 제출된 설계 동의입니다.' });

    res.json({
      customer_name: consent.Customer.name,
      customer_phone: consent.Customer.phone
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/public/design-consent/:token - 설계 동의 제출
router.post('/design-consent/:token', async (req, res, next) => {
  try {
    const consent = await DesignConsent.findOne({
      where: { token: req.params.token }
    });
    if (!consent) return res.status(404).json({ error: '유효하지 않은 링크입니다.' });
    if (consent.status === '완료') return res.status(400).json({ error: '이미 제출된 설계 동의입니다.' });

    const { address, address_main, address_detail, occupation, military_service, resident_number_front, resident_number_back } = req.body;

    await consent.update({
      address,
      occupation,
      military_service,
      resident_number_front,
      resident_number_back,
      status: '완료',
      submitted_at: new Date()
    });

    // 고객 정보 자동 업데이트 (생년월일, 성별, 주소, 직업)
    try {
      const customerUpdate = {};
      if (address_main) {
        customerUpdate.address = address_detail ? `${address_main}|${address_detail}` : address_main;
      }
      if (occupation) customerUpdate.occupation = occupation;

      if (resident_number_front && resident_number_back) {
        const yy = resident_number_front.substring(0, 2);
        const mm = resident_number_front.substring(2, 4);
        const dd = resident_number_front.substring(4, 6);
        const genderDigit = resident_number_back.substring(0, 1);

        // 1,2: 1900년대 / 3,4: 2000년대
        const century = ['1', '2', '5', '6'].includes(genderDigit) ? '19' : '20';
        customerUpdate.birth_date = `${century}${yy}-${mm}-${dd}`;
        customerUpdate.gender = ['1', '3'].includes(genderDigit) ? 'M' : 'F';
      }

      if (Object.keys(customerUpdate).length > 0) {
        await Customer.update(customerUpdate, { where: { id: consent.customer_id } });
      }
    } catch (updateErr) {
      console.error('고객 정보 자동 업데이트 실패:', updateErr.message);
    }

    res.json({ message: '설계 동의가 제출되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/public/article/:id - 공개 블로그 글 조회
router.get('/article/:id', async (req, res, next) => {
  try {
    const { InfoLink, Agent } = require('../models');
    const link = await InfoLink.findOne({
      where: { id: req.params.id, type: 'article', is_active: true },
      include: [{ model: Agent, attributes: ['name', 'position', 'branch', 'profile_image'] }]
    });
    if (!link) return res.status(404).json({ error: '글을 찾을 수 없습니다.' });
    res.json({ article: link });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
