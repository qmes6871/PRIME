const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InsuranceCompany = sequelize.define('InsuranceCompany', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('생명', '손해'),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    fax: {
      type: DataTypes.STRING(20)
    },
    logo_url: {
      type: DataTypes.STRING(500)
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'insurance_companies'
  });

  return InsuranceCompany;
};
