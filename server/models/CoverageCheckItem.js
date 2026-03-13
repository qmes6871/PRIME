const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CoverageCheckItem = sequelize.define('CoverageCheckItem', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: '카테고리 (사망, 진단, 수술, 입원 등)'
    },
    item_name: {
      type: DataTypes.STRING(200),
      allowNull: false
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
    tableName: 'coverage_check_items'
  });

  return CoverageCheckItem;
};
