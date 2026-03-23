const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const Agent = require('./Agent')(sequelize);
const Customer = require('./Customer')(sequelize);
const Consultation = require('./Consultation')(sequelize);
const ConsultationInsurer = require('./ConsultationInsurer')(sequelize);
const InsuranceCompany = require('./InsuranceCompany')(sequelize);
const CoverageCheckItem = require('./CoverageCheckItem')(sequelize);
const CustomerCoverage = require('./CustomerCoverage')(sequelize);
const MessageTemplate = require('./MessageTemplate')(sequelize);
const MessageLog = require('./MessageLog')(sequelize);
const InfoLink = require('./InfoLink')(sequelize);
const SurveyResponse = require('./SurveyResponse')(sequelize);
const AgentSetting = require('./AgentSetting')(sequelize);
const ConsultationHistory = require('./ConsultationHistory')(sequelize);

// Associations
Agent.hasMany(Customer, { foreignKey: 'agent_id' });
Customer.belongsTo(Agent, { foreignKey: 'agent_id' });

Agent.hasMany(Consultation, { foreignKey: 'agent_id' });
Consultation.belongsTo(Agent, { foreignKey: 'agent_id' });

Customer.hasMany(Consultation, { foreignKey: 'customer_id' });
Consultation.belongsTo(Customer, { foreignKey: 'customer_id' });

Consultation.hasMany(ConsultationInsurer, { foreignKey: 'consultation_id', as: 'insurers' });
ConsultationInsurer.belongsTo(Consultation, { foreignKey: 'consultation_id' });

InsuranceCompany.hasMany(ConsultationInsurer, { foreignKey: 'insurance_company_id' });
ConsultationInsurer.belongsTo(InsuranceCompany, { foreignKey: 'insurance_company_id' });

Agent.hasMany(CoverageCheckItem, { foreignKey: 'agent_id' });
CoverageCheckItem.belongsTo(Agent, { foreignKey: 'agent_id' });

Customer.hasMany(CustomerCoverage, { foreignKey: 'customer_id' });
CustomerCoverage.belongsTo(Customer, { foreignKey: 'customer_id' });

Agent.hasMany(CustomerCoverage, { foreignKey: 'agent_id' });
CustomerCoverage.belongsTo(Agent, { foreignKey: 'agent_id' });

Agent.hasMany(MessageTemplate, { foreignKey: 'agent_id' });
MessageTemplate.belongsTo(Agent, { foreignKey: 'agent_id' });

Agent.hasMany(MessageLog, { foreignKey: 'agent_id' });
MessageLog.belongsTo(Agent, { foreignKey: 'agent_id' });

Customer.hasMany(MessageLog, { foreignKey: 'customer_id' });
MessageLog.belongsTo(Customer, { foreignKey: 'customer_id' });

Agent.hasMany(InfoLink, { foreignKey: 'agent_id' });
InfoLink.belongsTo(Agent, { foreignKey: 'agent_id' });

Agent.hasMany(SurveyResponse, { foreignKey: 'agent_id' });
SurveyResponse.belongsTo(Agent, { foreignKey: 'agent_id' });

Customer.hasMany(SurveyResponse, { foreignKey: 'customer_id' });
SurveyResponse.belongsTo(Customer, { foreignKey: 'customer_id' });

Agent.hasOne(AgentSetting, { foreignKey: 'agent_id' });
AgentSetting.belongsTo(Agent, { foreignKey: 'agent_id' });

Consultation.hasMany(ConsultationHistory, { foreignKey: 'consultation_id', as: 'histories' });
ConsultationHistory.belongsTo(Consultation, { foreignKey: 'consultation_id' });

module.exports = {
  sequelize,
  Agent,
  Customer,
  Consultation,
  ConsultationInsurer,
  InsuranceCompany,
  CoverageCheckItem,
  CustomerCoverage,
  MessageTemplate,
  MessageLog,
  InfoLink,
  SurveyResponse,
  AgentSetting,
  ConsultationHistory
};
