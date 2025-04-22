const { Pool } = require("pg");
require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;

module.exports = new Pool({
  connectionString: DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
