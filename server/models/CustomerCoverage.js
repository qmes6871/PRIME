const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CustomerCoverage = sequelize.define('CustomerCoverage', {
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
    insurance_company: {
      type: DataTypes.STRING(100)
    },
    product_name: {
      type: DataTypes.STRING(200)
    },
    category: {
      type: DataTypes.STRING(50),
      comment: '보장 카테고리'
    },
    coverage_name: {
      type: DataTypes.STRING(200),
      comment: '보장 항목명'
    },
    coverage_amount: {
      type: DataTypes.BIGINT,
      comment: '보장 금액'
    },
    premium: {
      type: DataTypes.INTEGER,
      comment: '보험료'
    },
    contract_date: {
      type: DataTypes.DATEONLY
    },
    expiry_date: {
      type: DataTypes.DATEONLY
    },
    payment_period: {
      type: DataTypes.STRING(50),
      comment: '납입기간'
    },
    status: {
      type: DataTypes.ENUM('유지', '실효', '해지', '만기'),
      defaultValue: '유지'
    },
    note: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'customer_coverages'
  });

  return CustomerCoverage;
};
