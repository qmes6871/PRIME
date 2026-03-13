const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SurveyResponse = sequelize.define('SurveyResponse', {
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
      comment: '연결된 고객 (나중에 매칭)'
    },
    respondent_name: {
      type: DataTypes.STRING(50)
    },
    respondent_phone: {
      type: DataTypes.STRING(20)
    },
    respondent_email: {
      type: DataTypes.STRING(100)
    },
    birth_date: {
      type: DataTypes.DATEONLY
    },
    gender: {
      type: DataTypes.ENUM('M', 'F')
    },
    answers: {
      type: DataTypes.JSON,
      comment: '설문 응답 데이터'
    },
    status: {
      type: DataTypes.ENUM('신규', '확인완료', '상담연결'),
      defaultValue: '신규'
    },
    memo: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'survey_responses'
  });

  return SurveyResponse;
};
