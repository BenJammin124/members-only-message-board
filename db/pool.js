const { Pool } = require("pg");
require("dotenv").config();

const DB_STRING = process.env.DB_STRING;

module.exports = new Pool({
  connectionString: DB_STRING,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
