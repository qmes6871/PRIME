const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ConsultationHistory = sequelize.define('ConsultationHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    consultation_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    proposal_html: {
      type: DataTypes.TEXT('long')
    },
    progress_memo: {
      type: DataTypes.TEXT
    },
    save_type: {
      type: DataTypes.ENUM('auto', 'manual'),
      defaultValue: 'auto'
    },
    label: {
      type: DataTypes.STRING(100)
    }
  }, {
    tableName: 'consultation_histories'
  });

  return ConsultationHistory;
};
