const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ConsultationInsurer = sequelize.define('ConsultationInsurer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    consultation_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    insurance_company_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING(200)
    },
    premium: {
      type: DataTypes.INTEGER,
      comment: '보험료'
    },
    fax_number: {
      type: DataTypes.STRING(20)
    },
    note: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'consultation_insurers'
  });

  return ConsultationInsurer;
};
