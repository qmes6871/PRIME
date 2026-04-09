const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20)
    },
    email: {
      type: DataTypes.STRING(100)
    },
    birth_date: {
      type: DataTypes.DATEONLY
    },
    gender: {
      type: DataTypes.ENUM('M', 'F'),
    },
    status: {
      type: DataTypes.ENUM('상담전', '상담중', '청약완료', '상담완료'),
      defaultValue: '상담전'
    },
    memo: {
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING(500)
    },
    occupation: {
      type: DataTypes.STRING(100),
      comment: '직업'
    },
    insurance_age: {
      type: DataTypes.INTEGER,
      comment: '보험나이'
    },
    policy_anniversary: {
      type: DataTypes.DATEONLY,
      comment: '상령일'
    },
    consult_date: {
      type: DataTypes.TEXT,
      comment: '상담 예정일시'
    }
  }, {
    tableName: 'customers'
  });

  return Customer;
};
