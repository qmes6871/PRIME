const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MessageLog = sequelize.define('MessageLog', {
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
      type: DataTypes.INTEGER
    },
    template_id: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.ENUM('카카오알림톡', 'SMS', '클립보드'),
      allowNull: false
    },
    recipient_phone: {
      type: DataTypes.STRING(20)
    },
    recipient_name: {
      type: DataTypes.STRING(50)
    },
    content: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('성공', '실패', '대기'),
      defaultValue: '대기'
    },
    error_message: {
      type: DataTypes.TEXT
    },
    sent_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'message_logs'
  });

  return MessageLog;
};
