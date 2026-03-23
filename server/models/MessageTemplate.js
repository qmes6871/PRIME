const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MessageTemplate = sequelize.define('MessageTemplate', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '템플릿 유형 (담당자변경, 해지, 실효해지, 청구서류, 자동이체해지, 인사, 일정, 자료, 종료)'
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    variables: {
      type: DataTypes.JSON,
      comment: '템플릿 변수 목록'
    },
    category: {
      type: DataTypes.ENUM('메시지안내', '알림톡', '특별알림'),
      defaultValue: '메시지안내'
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'message_templates'
  });

  return MessageTemplate;
};
