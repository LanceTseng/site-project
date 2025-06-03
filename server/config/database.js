require('dotenv').config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');

const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // <- Add this line!
    dialect: process.env.DB_DIALECT,
  }
);

module.exports = database;
