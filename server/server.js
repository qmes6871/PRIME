require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const seedData = require('./seeders/seed');

const PORT = process.env.PORT || 3030;

async function start() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Sync models (create tables if not exist)
    await sequelize.sync({ alter: false });
    console.log('Database synced.');

    // Run seeders
    await seedData();

    // Start server
    app.listen(PORT, () => {
      console.log(`Prime Asset server running on port ${PORT}`);
      console.log(`Access at: http://localhost:${PORT}/prime`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
