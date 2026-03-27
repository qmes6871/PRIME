const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AgentSetting = sequelize.define('AgentSetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    menu_order: {
      type: DataTypes.JSON,
      comment: '메뉴 순서 커스터마이징'
    },
    menu_labels: {
      type: DataTypes.JSON,
      comment: '메뉴명 커스터마이징'
    },
    kakao_channel_id: {
      type: DataTypes.STRING(100)
    },
    nhn_app_key: {
      type: DataTypes.STRING(200)
    },
    nhn_secret_key: {
      type: DataTypes.STRING(200)
    },
    nhn_sender_key: {
      type: DataTypes.STRING(200)
    },
    company_name: {
      type: DataTypes.STRING(100),
      defaultValue: '프라임에셋'
    },
    greeting_name: {
      type: DataTypes.STRING(50),
      comment: '인사말에 표시할 이름'
    },
    survey_intro: {
      type: DataTypes.TEXT,
      comment: '설문조사 인트로 문구'
    },
    fax_number: {
      type: DataTypes.STRING(20),
      comment: '팩스번호'
    },
    online_reservation_url: {
      type: DataTypes.STRING(500),
      comment: '온라인 예약 링크'
    },
    kakao_talk_url: {
      type: DataTypes.STRING(500),
      comment: '카카오톡 상담 링크'
    },
    proposal_layout: {
      type: DataTypes.STRING(20),
      defaultValue: 'photo',
      comment: '제안서 헤더 레이아웃: photo(배경사진) / circle(동그라미)'
    },
    coverage_labels: {
      type: DataTypes.JSON,
      comment: '보장분석 용어 커스터마이징 {catKey: {fieldKey: "커스텀라벨"}}'
    }
  }, {
    tableName: 'agent_settings'
  });

  return AgentSetting;
};
