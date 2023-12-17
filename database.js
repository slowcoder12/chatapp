const Sequelize = require("sequelize");
// const dotenv = require("dotenv");

// dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.USERNAME,
  process.env.DB_PASSWORD,
  { dialect: "mysql", host: process.env.DB_HOST }
);

module.exports = sequelize;
