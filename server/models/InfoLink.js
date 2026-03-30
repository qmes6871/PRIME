const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InfoLink = sequelize.define('InfoLink', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500)
    },
    icon: {
      type: DataTypes.STRING(50),
      defaultValue: '🔗'
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      field: 'image_url',
      comment: '대표 이미지 URL'
    },
    category: {
      type: DataTypes.STRING(100),
      comment: '카테고리'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'info_links'
  });

  return InfoLink;
};
