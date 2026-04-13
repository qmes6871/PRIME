const express = require('express');
const router = express.Router();
const { Customer, Consultation, SurveyResponse, MessageLog } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

// GET /api/v1/dashboard
router.get('/', async (req, res, next) => {
  try {
    const agentId = req.agent.id;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // 고객 현황
    const totalCustomers = await Customer.count({ where: { agent_id: agentId } });
    const statusCounts = await Customer.findAll({
      where: { agent_id: agentId },
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true
    });

    // 상담 현황
    const totalConsultations = await Consultation.count({ where: { agent_id: agentId } });
    const activeConsultations = await Consultation.count({
      where: { agent_id: agentId, status: '작성중' }
    });

    // 이번 달 메시지 발송 수
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyMessages = await MessageLog.count({
      where: {
        agent_id: agentId,
        created_at: { [Op.gte]: startOfMonth }
      }
    });

    // 신규 설문 응답 수
    const newSurveys = await SurveyResponse.count({
      where: { agent_id: agentId, status: '신규' }
    });

    // 생일/상령일 알림 (30일 이내)
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const mm2 = String(thirtyDaysLater.getMonth() + 1).padStart(2, '0');
    const dd2 = String(thirtyDaysLater.getDate()).padStart(2, '0');

    // 생일 알림 - month/day 기준으로 30일 이내
    const birthdayCustomers = await Customer.findAll({
      where: {
        agent_id: agentId,
        birth_date: { [Op.ne]: null }
      },
      attributes: ['id', 'name', 'phone', 'birth_date', 'status'],
      raw: true
    });

    const upcomingBirthdays = birthdayCustomers.filter(c => {
      if (!c.birth_date) return false;
      const bd = new Date(c.birth_date);
      const thisYearBd = new Date(today.getFullYear(), bd.getMonth(), bd.getDate());
      if (thisYearBd < today) thisYearBd.setFullYear(today.getFullYear() + 1);
      const diff = (thisYearBd - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    });

    // 상령일 알림 (생일 + 6개월 = 보험나이 올라가는 날)
    const anniversaryCustomers = await Customer.findAll({
      where: {
        agent_id: agentId,
        birth_date: { [Op.ne]: null }
      },
      attributes: ['id', 'name', 'phone', 'birth_date', 'status'],
      raw: true
    });

    const upcomingAnniversaries = anniversaryCustomers.filter(c => {
      if (!c.birth_date) return false;
      const bd = new Date(c.birth_date);
      // 상령일 = 생일 + 6개월
      const sangMonth = bd.getMonth() + 6;
      const sangDay = bd.getDate();
      const thisYearSang = new Date(today.getFullYear(), sangMonth, sangDay);
      if (thisYearSang < today) thisYearSang.setFullYear(today.getFullYear() + 1);
      const diff = (thisYearSang - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    });

    // 최근 고객
    const recentCustomers = await Customer.findAll({
      where: { agent_id: agentId },
      order: [['created_at', 'DESC']],
      limit: 10
    });

    res.json({
      summary: {
        totalCustomers,
        statusCounts: statusCounts.reduce((acc, s) => { acc[s.status] = parseInt(s.count); return acc; }, {}),
        totalConsultations,
        activeConsultations,
        monthlyMessages,
        newSurveys
      },
      alerts: {
        birthdays: upcomingBirthdays,
        anniversaries: upcomingAnniversaries
      },
      recentCustomers
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
