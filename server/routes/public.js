const express = require('express');
const router = express.Router();
const { Consultation, ConsultationInsurer, InsuranceCompany, Customer, Agent, SurveyResponse, AgentSetting, CustomerCoverage, CoverageCheckItem } = require('../models');

// GET /api/v1/public/proposal/:token - 고객용 제안서 (인증 불필요)
router.get('/proposal/:token', async (req, res, next) => {
  try {
    const consultation = await Consultation.findOne({
      where: { share_token: req.params.token },
      include: [
        { model: Customer, attributes: ['id', 'name'] },
        { model: Agent, attributes: ['id', 'name', 'phone', 'email', 'position', 'branch', 'profile_image'] },
        { model: ConsultationInsurer, as: 'insurers', include: [InsuranceCompany] }
      ]
    });

    if (!consultation) {
      return res.status(404).json({ error: '제안서를 찾을 수 없습니다.' });
    }

    if (consultation.share_expires_at && new Date() > consultation.share_expires_at) {
      return res.status(410).json({ error: '만료된 링크입니다.' });
    }

    // Mark as viewed
    if (!consultation.viewed_at) {
      await consultation.update({ viewed_at: new Date(), status: '확인완료' });
    }

    // 설정 정보도 함께 전달 (온라인예약, 카카오톡 URL 등)
    const settings = await AgentSetting.findOne({
      where: { agent_id: consultation.agent_id },
      attributes: ['fax_number', 'online_reservation_url', 'kakao_talk_url']
    });

    res.json({ consultation, settings });
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

module.exports = router;
