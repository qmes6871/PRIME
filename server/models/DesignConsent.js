const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DesignConsent = sequelize.define('DesignConsent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('대기', '완료'),
      defaultValue: '대기'
    },
    address: {
      type: DataTypes.STRING(500),
      comment: '고객 입력 주소'
    },
    occupation: {
      type: DataTypes.STRING(100),
      comment: '직업'
    },
    military_service: {
      type: DataTypes.STRING(100),
      comment: '병력 상태'
    },
    resident_number_front: {
      type: DataTypes.STRING(6),
      comment: '주민등록번호 앞자리'
    },
    resident_number_back: {
      type: DataTypes.STRING(7),
      comment: '주민등록번호 뒷자리'
    },
    submitted_at: {
      type: DataTypes.DATE,
      comment: '제출 일시'
    }
  }, {
    tableName: 'design_consents'
  });

  return DesignConsent;
};
