const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = (sequelize) => {
  const Consultation = sequelize.define('Consultation', {
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
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200)
    },
    status: {
      type: DataTypes.ENUM('작성중', '발송완료', '확인완료'),
      defaultValue: '작성중'
    },
    proposal_html: {
      type: DataTypes.TEXT('long'),
      comment: '제안서 HTML'
    },
    progress_memo: {
      type: DataTypes.TEXT,
      comment: '진행메모'
    },
    checklist: {
      type: DataTypes.JSON,
      comment: '고객 체크리스트'
    },
    share_token: {
      type: DataTypes.STRING(50),
      unique: true
    },
    share_expires_at: {
      type: DataTypes.DATE
    },
    shared_at: {
      type: DataTypes.DATE
    },
    viewed_at: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'consultations'
  });

  Consultation.generateShareToken = () => {
    return crypto.randomBytes(12).toString('hex');
  };

  return Consultation;
};
