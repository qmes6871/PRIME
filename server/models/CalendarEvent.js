const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CalendarEvent = sequelize.define('CalendarEvent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '연결된 고객'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: 'HH:mm 형식'
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_time: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    all_day: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    color: {
      type: DataTypes.STRING(20),
      defaultValue: 'blue',
      comment: 'blue/green/red/orange/purple/pink'
    },
    category: {
      type: DataTypes.ENUM('상담', '미팅', '서류', '기타'),
      defaultValue: '상담'
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    recurrence_type: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: true
    },
    recurrence_end: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    source: {
      type: DataTypes.STRING(30),
      defaultValue: 'manual',
      comment: 'manual / consult_date'
    },
    source_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '원본 참조 ID (예: customer_123)'
    }
  }, {
    tableName: 'calendar_events'
  });

  return CalendarEvent;
};
