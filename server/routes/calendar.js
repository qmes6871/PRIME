const express = require('express');
const router = express.Router();
const { CalendarEvent, CalendarTodo, Customer } = require('../models');
const { Op } = require('sequelize');

// ============ EVENTS ============

// GET /api/v1/calendar/events?year=2026&month=4
router.get('/events', async (req, res, next) => {
  try {
    const { year, month, start, end } = req.query;
    const where = { agent_id: req.agent.id };

    if (start && end) {
      where.start_date = { [Op.between]: [start, end] };
    } else if (year && month) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0);
      const endStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      where.start_date = { [Op.between]: [startDate, endStr] };
    }

    const events = await CalendarEvent.findAll({
      where,
      include: [{ model: Customer, attributes: ['id', 'name', 'phone', 'status'] }],
      order: [['start_date', 'ASC'], ['start_time', 'ASC']]
    });

    res.json({ events });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/calendar/events
router.post('/events', async (req, res, next) => {
  try {
    const event = await CalendarEvent.create({
      ...req.body,
      agent_id: req.agent.id
    });
    const full = await CalendarEvent.findByPk(event.id, {
      include: [{ model: Customer, attributes: ['id', 'name', 'phone', 'status'] }]
    });
    res.status(201).json({ event: full });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/calendar/events/:id
router.put('/events/:id', async (req, res, next) => {
  try {
    const event = await CalendarEvent.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!event) return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });

    await event.update(req.body);
    const full = await CalendarEvent.findByPk(event.id, {
      include: [{ model: Customer, attributes: ['id', 'name', 'phone', 'status'] }]
    });
    res.json({ event: full });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/calendar/events/:id/move (드래그 앤 드롭)
router.patch('/events/:id/move', async (req, res, next) => {
  try {
    const { start_date, end_date } = req.body;
    const event = await CalendarEvent.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!event) return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });

    await event.update({ start_date, end_date: end_date || start_date });
    res.json({ event });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/calendar/events/:id
router.delete('/events/:id', async (req, res, next) => {
  try {
    const event = await CalendarEvent.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!event) return res.status(404).json({ error: '일정을 찾을 수 없습니다.' });

    await event.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// ============ TODOS ============

// GET /api/v1/calendar/todos?date=2026-04-10 or ?year=2026&month=4
router.get('/todos', async (req, res, next) => {
  try {
    const { date, year, month, start, end } = req.query;
    const where = { agent_id: req.agent.id };

    const undated = req.query.undated === 'true';

    if (undated) {
      where.due_date = null;
    } else if (date) {
      where.due_date = date;
    } else if (start && end) {
      where.due_date = { [Op.between]: [start, end] };
    } else if (year && month) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0);
      const endStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
      where.due_date = { [Op.between]: [startDate, endStr] };
    }

    const todos = await CalendarTodo.findAll({
      where,
      include: [{ model: Customer, attributes: ['id', 'name', 'phone'] }],
      order: [['is_completed', 'ASC'], ['priority', 'DESC'], ['sort_order', 'ASC']]
    });

    res.json({ todos });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/calendar/todos
router.post('/todos', async (req, res, next) => {
  try {
    const todo = await CalendarTodo.create({
      ...req.body,
      agent_id: req.agent.id
    });
    res.status(201).json({ todo });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/calendar/todos/:id
router.put('/todos/:id', async (req, res, next) => {
  try {
    const todo = await CalendarTodo.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!todo) return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });

    await todo.update(req.body);
    res.json({ todo });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/calendar/todos/:id/toggle
router.patch('/todos/:id/toggle', async (req, res, next) => {
  try {
    const todo = await CalendarTodo.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!todo) return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });

    const newCompleted = !todo.is_completed;
    await todo.update({
      is_completed: newCompleted,
      completed_at: newCompleted ? new Date() : null
    });
    res.json({ todo });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/calendar/todos/:id/move
router.patch('/todos/:id/move', async (req, res, next) => {
  try {
    const { due_date } = req.body;
    const todo = await CalendarTodo.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!todo) return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });

    await todo.update({ due_date });
    res.json({ todo });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/calendar/todos/:id
router.delete('/todos/:id', async (req, res, next) => {
  try {
    const todo = await CalendarTodo.findOne({
      where: { id: req.params.id, agent_id: req.agent.id }
    });
    if (!todo) return res.status(404).json({ error: '할일을 찾을 수 없습니다.' });

    await todo.destroy();
    res.json({ message: '삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
});

// ============ DASHBOARD WIDGET ============

// GET /api/v1/calendar/upcoming
router.get('/upcoming', async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const weekEnd = new Date();
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const todayEvents = await CalendarEvent.findAll({
      where: { agent_id: req.agent.id, start_date: today },
      include: [{ model: Customer, attributes: ['id', 'name', 'phone'] }],
      order: [['start_time', 'ASC']]
    });

    const weekEvents = await CalendarEvent.findAll({
      where: {
        agent_id: req.agent.id,
        start_date: { [Op.between]: [today, weekEndStr] }
      },
      include: [{ model: Customer, attributes: ['id', 'name', 'phone'] }],
      order: [['start_date', 'ASC'], ['start_time', 'ASC']],
      limit: 10
    });

    const todayTodos = await CalendarTodo.findAll({
      where: { agent_id: req.agent.id, due_date: today },
      order: [['is_completed', 'ASC'], ['priority', 'DESC']]
    });

    const overdueTodos = await CalendarTodo.findAll({
      where: {
        agent_id: req.agent.id,
        due_date: { [Op.lt]: today },
        is_completed: false
      },
      order: [['due_date', 'ASC']],
      limit: 5
    });

    res.json({ todayEvents, weekEvents, todayTodos, overdueTodos });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
